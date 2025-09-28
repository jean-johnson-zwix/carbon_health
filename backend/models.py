from pydantic import BaseModel
from typing import List
import datetime

# =========================
# User Data Models
# =========================
class User(BaseModel):
    username: str
    name: str
    email: str
    password: str
    heat_source: str
    housing: str
    income: float

class LoginRequest(BaseModel):
    username: str
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

class CalculateRequest(BaseModel):
    username: str
    date: datetime.date
    trips: List[Trip] = []
    power_use: List[PowerUse] = []
    meals: List[Meal] = []

