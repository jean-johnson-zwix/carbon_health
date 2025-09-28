# Carbon Health
A web application designed to track your personal carbon footprint.


## Set up

Step 1: Clone the repository

```
git clone https://github.com/jean-johnson-zwix/carbon_health
cd carbon_health
cd backend
```

Step 2: Setup the python environmnet

```
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Step 3: Run the application

```
uvicorn main:app --port 5000
```

## Features

- Calculate daily carbon emissions based on transportation, power consumed and food consumed
- Display carbon emissions for the day, week, month
- Use Gemini AI agent to give recommendations to reduce the carbon footprint based on historical data
- (Phase 2) Forecast future carbon emission trends for the user.

### Carbon Emission Calculation

### Transportation
Input
- Miles travelled (mi): float
- Mode of transport (bus/car/rail/walk)

### Power consumption
Input:
- Usage Hours (hours) : float
- Device Type: (phone/tv/computer)

### Food Data
Input: 
- No. of Meat Serving (100g): integer
- Type of Meat (beef/pork/chicken)




