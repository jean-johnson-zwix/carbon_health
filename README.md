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


# API REFERENCE

## Login API

Endpoint: /login

cURL Command:

```
curl --location 'http://localhost:5000/login' \
--header 'Content-Type: application/json' \
--data '{
	"username":"john",
	"password":"secretpassword"
}'
```

Sample Request:

```
{
	"username":"john",
	"password":"secretpassword"
}
```

Sample Response:

```
{
    "access_token": "",
    "token_type": "bearer"
}
```

## Register API

Endpoint: /register

cURL Command:

```
curl --location 'http://localhost:5000/register' \
--header 'Content-Type: application/json' \
--data-raw '{
	"username":"john",
	"name":"John Smith",
	"email":"john_smith@gmail.com",
	"password":"secretpassword",
	"heat_source": "electric",
	"housing":"3b2b",
	"income":3500.00
}'
```

Sample Request:

```
{
	"username":"john",
	"name":"John Smith",
	"email":"john_smith@gmail.com",
	"password":"secretpassword",
	"heat_source": "electric",
	"housing":"3b2b",
	"income":3500.00
}
```

Sample Response:

```
{
    "response": "Registration successful for john!"
}
```

## Calculate API

Endpoint: /calculate

cURL Command:

```
curl --location 'http://localhost:3000/calculate' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer *token*' \
--data '{
	"username" : "john",
	"date":"2025-09-27",
	"meals":[
		{
			"servings":1,
			"meat":"chicken"
		}
    ]
}'
```

Sample Request:

```
{
	"username" : "john",
	"date":"2025-09-27",
	"meals":[
		{
			"servings":1,
			"meat":"chicken"
		}
    ]
}
```

Sample Response:

```
{
    "transport_emission": 2.49,
    "power_emission": 0.172,
    "meal_emission": 2.5,
    "total_emission": 5.16
}
```

## Weekly Report API

Endpoint: /summary/weekly/{username}

cURL Command:

```
curl --location 'http://localhost:3000/summary/weekly/john' \
--header 'Authorization: Bearer *token*'
```

Sample Response:

```
{
    "username": "john",
    "week_start_date": "2025-09-28",
    "week_end_date": "2025-10-04",
    "records": [
        {
            "username": "john",
            "transport_emission": 6.12,
            "power_emission": 0.12,
            "total_emission": 12.14,
            "meal_emission": 5.9,
            "date": "2025-09-28"
        }
    ],
    "weekly_total_emission": 12.14
}
```

## Monthly API

Endpoint: /summary/monthly/{username}/{year}/{month}

cURL Command:

```
curl --location 'http://localhost:3000/summary/monthly/john/2025/9' \
--header 'Authorization: Bearer *token*'
```

Sample Response:

```
{
    "username": "john",
    "year": 2025,
    "month": 9,
    "records": [
        {
            "username": "john",
            "transport_emission": 6.12,
            "power_emission": 0.12,
            "total_emission": 12.14,
            "meal_emission": 5.9,
            "date": "2025-09-23"
        },
        {
            "last_updated": "2025-09-28T11:37:39.894000+00:00",
            "username": "john",
            "transport_emission": 2.49,
            "power_emission": 0.172,
            "total_emission": 5.16,
            "meal_emission": 2.5,
            "date": "2025-09-27"
        },
        {
            "username": "john",
            "transport_emission": 6.12,
            "power_emission": 0.12,
            "total_emission": 12.14,
            "meal_emission": 5.9,
            "date": "2025-09-28"
        }
    ],
    "monthly_total_emission": 29.44
}
```

## Carbon Emission Reduction Recommendation API

Endpoint: recommendation/{username}

cURL Command:

```
curl --location --request POST 'http://localhost:3000/recommendation/john' \
--header 'Authorization: Bearer *token*'
```

Sample Response:

```
{
    "recommendations": [
        {
            "recommendation": "With your average daily transport emissions around 4.9 kg CO2, aim to combine errands or consider cycling/walking for short trips (under 2 miles) instead of driving at least 3-4 times a week.",
            "impact": "Each short car trip avoided can save approximately 0.5 - 1 kg CO2. Doing this 3-4 times a week could reduce your transport emissions by 1.5 - 4 kg CO2 weekly, plus save on fuel costs."
        },
        {
            "recommendation": "To address your average daily meal emissions of approximately 4.8 kg CO2, try swapping out one red meat meal per week for a plant-based alternative, like a lentil stew or a bean burger, and exploring vegetarian options for lunch on two other days.",
            "impact": "Replacing just one red meat meal can save 2-5 kg CO2 per week, and choosing plant-based lunches further amplifies this, significantly lowering your overall food carbon footprint and potentially your grocery bill."
        },
        {
            "recommendation": "Even though your reported power emissions are currently low, as a 3b2b home with electric heating, ensuring energy efficiency is key. Start with a budget-friendly step: check for and seal drafts around windows and doors with weatherstripping or caulk.",
            "impact": "Sealing drafts can prevent significant heat loss in winter and heat gain in summer, making your electric heating/cooling systems more efficient. This could save 5-10% on energy bills and reduce associated emissions when heating or cooling is actively used, which is particularly relevant for electric heating."
        }
    ]
}
```