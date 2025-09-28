from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List
import json
import os
from models import User, LoginRequest
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
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        return email
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")


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
    return {'response': f'{user.name} saved successfully!'}

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
        data={"sub": user['email']},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {'token': access_token, 'username': login_request.username}
