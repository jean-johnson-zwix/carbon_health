from sqlalchemy import Column, Integer, String, Float, Date
from database import Base

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    name = Column(String, index=True)
    password = Column(String)

class EmissionRecord(Base):
    __tablename__ = 'emissions'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    date = Column(Date)
    transport_total = Column(Float)
    power_total = Column(Float)
    meal_total = Column(Float)
    total_co2 = Column(Float)
