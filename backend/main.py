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
SECRET_KEY = 'supersecret' #⚠️ replace with env variable in production
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
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
 

    

