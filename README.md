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

