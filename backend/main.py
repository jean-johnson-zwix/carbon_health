from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List
import json
import os
from models import User, LoginRequest, Trip, PowerUse, Meal, CalculateRequest
from datetime import date
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timezone, timedelta
import firebase_admin
from firebase_admin import credentials, firestore
from passlib.hash import argon2
from datetime import date, timedelta

import google.generativeai as genai
from pydantic import Field
import os

# =========================
# Agentic AI Setup
# =========================
BASE_END_MODEL='gemini-2.5-flash'
HIGH_END_MODEL='gemini-pro'
try:
	genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
	gemini_model = genai.GenerativeModel(BASE_END_MODEL)
except Exception as e:
	print(f"Error configuring Gemini API: {e}")
	gemini_model = None

# =========================
# Firebase Setup
# =========================

cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# =========================
# Authentication
# =========================

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

def hash_password(password: str) -> str:
	return argon2.hash(password)

def verify_password(plain_password: str, hashed_password: str) ->str:
	return argon2.verify(plain_password, hashed_password)

app = FastAPI(
	title="Carbon Health API",
	description="API for tracking personal carbon emissions."
)

# =========================
# JWT Authentication
# =========================
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict, expires_delta: timedelta | None = None):
	to_encode = data.copy()
	expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
	to_encode.update({'exp': expire})
	encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm=ALGORITHM)
	return encoded_jwt

# =========================
# Protect Routes With JWT
# =========================
from fastapi import Depends, status
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme)):
	credentials_exception = HTTPException(
		status_code=status.HTTP_401_UNAUTHORIZED,
		detail="Could not validate credentials",
		headers={"WWW-Authenticate": "Bearer"},
	)
	try:
		payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
		username: str = payload.get("sub")
		if username is None:
			raise credentials_exception
	except JWTError:
		raise credentials_exception
	return username


# =========================
# CO2 emission rates
# =========================
TRANSPORT_CO2 = {"bus": 0.4, "car": 0.09, "rail": 0.08, "walk": 0.0, "bike": 0.0}
DEVICE_CO2 = {"phone": 0.003, "tv": 0.03, "computer": 0.04}
MEAT_CO2 = {"beef": 2.5, "pork": 0.7, "chicken": 0.6}

# =========================
# User Routes
# =========================
@app.get("/test")
def handle_request():
	return {"message": "Test GET API"}

@app.post("/register")
def register(user: User):
	
	# check if user exist
	user_ref = db.collection('users').document(user.username)
	if user_ref.get().exists:
		raise HTTPException(status_code=409, detail="Username is taken")
	
	# add the user
	user_data = {
		"name": user.name,
		"email": user.email,
		"password": hash_password(user.password),
		"heat_source": user.heat_source,
		"housing": user.housing,
		"income": user.income
	}
	user_ref.set(user_data)
	return {'response': f'Registration successful for {user.username}!'}

@app.post("/login")
def login(login_request: LoginRequest):

	# check if user exist
	user_ref = db.collection('users').document(login_request.username)
	user = user_ref.get()
	if not user.exists:
		raise HTTPException(status_code=404, detail="User not found")
	user = user.to_dict()
	print(user)
	# match password
	if not verify_password(login_request.password, user['password']):
		raise HTTPException(status_code=401, detail='Incorrect credentials')
   
	# generate access token
	access_token = create_access_token(
		data={"sub": login_request.username},
		expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
	)
	
	return {'token': access_token, 'username': login_request.username}

def calculate(transport_records:List[Trip], power_records: List[PowerUse], meal_records:List[Meal]):
	transport_total = round(sum(
		TRANSPORT_CO2.get(trip.mode.lower(), 0) * trip.miles
		for trip in transport_records
	),2)
	power_total = round(sum(
		DEVICE_CO2.get(device.device.lower(), 0) * device.usage
		for device in power_records
	),2)
	meal_total = round(sum(
		MEAT_CO2.get(meal.meat.lower(), 0) * meal.servings
		for meal in meal_records
	),2)
	return {
		"transport_emission":transport_total,
		"power_emission":power_total,
		"meal_emission":meal_total,
		"total_emission":transport_total+power_total+meal_total
	}

@firestore.transactional
def update_co2_emission(transaction, current_emission_ref, new_emission_log):
	current_emission = current_emission_ref.get(transaction=transaction)
	try:
		new_emission = calculate(new_emission_log.trips, new_emission_log.power_use, new_emission_log.meals)
	except ValueError as e:
		raise HTTPException(status_code=400, detail=str(e))
	

	if current_emission.exists:
		daily_emission = {
		"transport_emission":current_emission.get('transport_emission')+new_emission.get('transport_emission'),
		"power_emission":current_emission.get('power_emission')+new_emission.get('power_emission'),
		"meal_emission":current_emission.get('meal_emission')+new_emission.get('meal_emission'),
		"total_emission":current_emission.get('total_emission')+new_emission.get('total_emission')
		}
		transaction.update(current_emission_ref, daily_emission)
		daily_emission['username'] = new_emission_log.username
		daily_emission['date'] = new_emission_log.date.isoformat()
		return daily_emission
	else:
		daily_emission = {
			"username":new_emission_log.username,
			"date":new_emission_log.date.isoformat(),
			"transport_emission":new_emission.get('transport_emission'),
			"power_emission":new_emission.get('power_emission'),
			"meal_emission":new_emission.get('meal_emission'),
			"total_emission":new_emission.get('total_emission')
		}
		transaction.set(current_emission_ref, daily_emission)
		return daily_emission



@app.post("/calculate")
def get_co2_emission(new_emission: CalculateRequest, current_user: str = Depends(get_current_user)):

	if new_emission.username != current_user:
		raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User not Authorized")

	# 1. Check if the user exists
	user_ref = db.collection('users').document(new_emission.username)
	if not user_ref.get().exists:
		raise HTTPException(status_code=404, detail=f"User not found.")

	# 2. Add/Update co2 emission record 
	current_emission_ref = db.collection('daily_emission').document(f'{new_emission.username}_{new_emission.date.isoformat()}')
	emission_summary = update_co2_emission(db.transaction(), current_emission_ref, new_emission)
	return emission_summary
 


@app.get("/summary/weekly/{username}")
def get_weekly_summary(username:str, report_date: date | None = None, current_user: str = Depends(get_current_user)):

	if username != current_user:
		raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User not Authorized")

	if report_date is None:
		report_date = date.today()

	# find the week
	days_since_sunday = (report_date.weekday() + 1) % 7
	start_of_week = report_date - timedelta(days=days_since_sunday)
	end_of_week = start_of_week + timedelta(days=6)

	# query the database
	docs = db.collection('daily_emission') \
			 .where('username', '==', username) \
			 .where('date', '>=', start_of_week.isoformat()) \
			 .where('date', '<=', end_of_week.isoformat()) \
			 .order_by('date') \
			 .stream()

	# retrieve records
	records = [doc.to_dict() for doc in docs]
	return {
		"username": username,
		"week_start_date": start_of_week.isoformat(),
		"week_end_date": end_of_week.isoformat(),
		"records": records,
		"weekly_total_emission": sum(rec.get('total_emission', 0) for rec in records)
	}


@app.get("/summary/monthly/{username}/{year}/{month}")
def get_monthly_summary(username: str, year: int, month: int, current_user: str = Depends(get_current_user)):

	if username != current_user:
		raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User not Authorized")

	# find the month
	start_of_month_str = f"{year}-{month:02d}-01"
	next_month = month + 1 if month < 12 else 1
	next_year = year if month < 12 else year + 1
	start_of_next_month_str = f"{next_year}-{next_month:02d}-01"

	# query the database
	docs = db.collection('daily_emission') \
			 .where('username', '==', username) \
			 .where('date', '>=', start_of_month_str) \
			 .where('date', '<', start_of_next_month_str) \
			 .order_by('date') \
			 .stream()

	# retrieve the records
	records = [doc.to_dict() for doc in docs]
	return {
		"username": username,
		"year": year,
		"month": month,
		"records": records,
		"monthly_total_emission": sum(rec.get('total_emission', 0) for rec in records)
	}

@app.post("/recommendation/{username}")
def get_recommendations(username: str, current_user: str = Depends(get_current_user)):

	if gemini_model is None:
			raise HTTPException(status_code=503, detail="Gemini API is not configured or available.")

	if username != current_user:
		raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User not Authorized")

	# 1. get user details
	user_ref = db.collection('users').document(username)
	user_doc = user_ref.get()
	if not user_doc.exists:
		raise HTTPException(status_code=404, detail=f"User '{username}' not found.")
	user_profile = user_doc.to_dict()

	# 2. get co2 emission history (last 30 days)
	thirty_days_ago = date.today() - timedelta(days=30)
	docs = db.collection('daily_emission') \
				.where('username', '==', username) \
				.where('date', '>=', thirty_days_ago.isoformat()) \
				.stream()

	# if there are no records, raise error
	emission_history = [doc.to_dict() for doc in docs]
	if not emission_history:
		raise HTTPException(status_code=404, detail="Not enough emission history to generate recommendations.")

	serializable_history = []
	for log in emission_history:
		if 'last_updated' in log and hasattr(log['last_updated'], 'isoformat'):
			log['last_updated'] = log['last_updated'].isoformat()
		serializable_history.append(log)
	
	# create the prompt
	prompt = f"""
		You are an expert sustainability coach. Your task is to provide personalized, actionable recommendations for a user to reduce their carbon footprint.

		**User Profile:**
		- Housing Type: {user_profile.get('housing', 'N/A')}
		- Primary Heating Source: {user_profile.get('heat_source', 'N/A')}
		- Income Bracket: {user_profile.get('income', 'N/A')}

		**User's Recent Emission Data Summary:**
		{json.dumps(emission_history, indent=2)}

		**Your Task:**
		Based on the user's profile and their emission data, identify their highest emission categories. Provide 3 specific, actionable, and personalized recommendations. For each recommendation, briefly explain the potential impact.

		**Output Format:**
		Generate a valid JSON object (do not wrap it in markdown ```json ... ```) with a single key "recommendations". This key should hold a list of objects, where each object has two keys: "recommendation" and "impact".

		Example:
		{{
		"recommendations": [
			{{
			"recommendation": "Try swapping two car trips per week with the bus for your 10-mile commute.",
			"impact": "This could save approximately 10 kg of CO2 per week, significantly reducing your transport emissions."
			}}
		]
		}}
		"""

	# call the gemini api
	try:
		response = gemini_model.generate_content(prompt)
		recommendation_json = json.loads(response.text.strip())
		return recommendation_json
	except Exception as e:
		print(f"Error calling Gemini API or parsing response: {e}")
		raise HTTPException(status_code=500, detail="Failed to generate recommendations from AI model.")

