from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import json
import os

app = FastAPI(
    title="Carbon Health API",
    description="API for tracking personal carbon emissions."
)

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
    
    users[user.email] = {"name": user.name, "password": user.password}
    save_users(users)
    
    return {"message": f"User {user.name} registered successfully!"}

@app.post("/login")
def login(user: LoginUser):
    users = load_users()
    
    if user.email not in users or users[user.email]["password"] != user.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {"message": f"Welcome back, {users[user.email]['name']}!"}

# =========================
# CO2 Calculation Route
# =========================
@app.post("/calculate")
def calculate_co2(data: CO2Data):
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
