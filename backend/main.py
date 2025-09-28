from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List
import json
import os
from database import Base, engine, SessionLocal
from models import EmissionRecord
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import date
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timezone, timedelta


# =========================
# Database
# =========================
Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# Authentication
# =========================

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) ->str:
    return pwd_context.verify(plain_password, hashed_password)

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
# User Data Models
# =========================
class User(BaseModel):
    name: str
    email: str
    password: str

class LoginUser(BaseModel):
    email: str
    password: str

# =========================
# CO2 Input Data Models
# =========================
class Trip(BaseModel):
    miles: float
    mode: str  # e.g., "bus", "car", "rail", "walk"

class PowerUse(BaseModel):
    usage: float
    device: str  # e.g., "phone", "tv", "computer"

class Meal(BaseModel):
    servings: float
    meat: str  # e.g., "beef", "pork", "chicken"

class CO2Data(BaseModel):
    day: int
    month: int
    year: int
    trips: List[Trip] = []
    power_use: List[PowerUse] = []
    meals: List[Meal] = []
    heat_source: str = None   # e.g., "gas", "electric", "oil"
    housing: str = None       # e.g., "apartment", "house"
    income: float = None      # user's income (for analytics, optional)

# =========================
# File to store users
# =========================
USER_FILE = "users.json"

# =========================
# Helper functions
# =========================
def load_users():
    if os.path.exists(USER_FILE):
        with open(USER_FILE, "r") as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USER_FILE, "w") as f:
        json.dump(users, f, indent=4)

# =========================
# CO2 emission rates
# =========================
TRANSPORT_CO2 = {"bus": 0.4, "car": 0.09, "rail": 0.08, "walk": 0.0, "bike": 0.0}
DEVICE_CO2 = {"phone": 0.003, "tv": 0.03, "computer": 0.04}
MEAT_CO2 = {"beef": 2.5, "pork": 0.7, "chicken": 0.6}

# =========================
# User Routes
# =========================
@app.get("/")
def handle_request():
    return {"message": "Welcome to Carbon Health API"}

@app.post("/register")
def register(user: User):
    users = load_users()
    
    if user.email in users:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    users[user.email] = {"name": user.name, "password": hash_password(user.password)}
    save_users(users)
    
    return {"message": f"User {user.name} registered successfully!"}

@app.post("/login")
def login(user: LoginUser):
    users = load_users()
    
    
    if user.email not in users or users[user.email]["password"] != user.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    hashed_password = users[user.email]["password"]
    if not verify_password(user.password, user[user.email]['password']):
        raise HTTPException(status_code=401, detail='invalid email or password')
    
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {'access_token': access_token, 'token_type': 'bearer'}

# =========================
# CO2 Calculation Route
# =========================
@app.post("/calculate")
def calculate_co2(data: CO2Data, db: Session = Depends(get_db)):
    # Transport total
    transport_total = sum(
        TRANSPORT_CO2.get(trip.mode.lower(), 0) * trip.miles
        for trip in data.trips
    )

    # Power total
    power_total = sum(
        DEVICE_CO2.get(device.device.lower(), 0) * device.usage
        for device in data.power_use
    )

    # Meal total
    meal_total = sum(
        MEAT_CO2.get(meal.meat.lower(), 0) * meal.servings
        for meal in data.meals
    )

    total_co2 = transport_total + power_total + meal_total

    date_str = f"{data.year:04d}-{data.month:02d}-{data.day:02d}"
    
    record = EmissionRecord(
        user_id=1,   #static for now
        date=date(data.year, data.month, data.day),
        transport_total = transport_total,
        power_total=power_total,
        meal_total=meal_total,
        total_co2 = total_co2,
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "transport_total": round(transport_total, 3),
        "power_total": round(power_total, 3),
        "meal_total": round(meal_total, 3),
        "total_co2": round(total_co2, 3),
        "date": date_str,
        "heat_source": data.heat_source,
        "housing": data.housing,
        "income": data.income
    }


# =========================
# History Route
# =========================

@app.get('/history/{period}')
def get_history(period: str, db: Session = Depends(get_db)):
    q = db.query(EmissionRecord)

    if period == 'daily':
        records = q.order_by(EmissionRecord.date.desc()).limit(1).all()
    elif period == 'weekly':
        records = q.order_by(EmissionRecord.date.desc()).limit(7).all()
    elif period == 'monthly':
        records = q.order_by(EmissionRecord.date.desc()).limit(30).all()
    else:
        return {"error": "Invalid period. Use daily, weekly, or monthly."}
    
    return [
        {
            'date': r.date.isoformat(),
            'transport': r.transport_total,
            'power': r.power_total,
            'meal': r.meal_total,
            'total': r.total_co2
        }
        for r in records
    ]
