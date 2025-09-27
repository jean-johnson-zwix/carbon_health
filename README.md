# Carbon Health
A web application designed to track your personal carbon footprint.

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
Calculation
- Bus CO2 Emissions = Usage Hours * 0.4 CO2/h
- Car CO2 Emissions = Usage Hours * 0.09 CO2/h
- Rail CO2 Emissions = Usage Hours * 0.08 CO2/h


### Power consumption
Input:
- Usage Hours (hours) : float
- Device Type: (phone/tv/computer)
Calculation:
- Phone CO2 Emissions = Usage Hours * 0.003 CO2/h
- TV CO2 Emissions = Usage Hours * 0.03 CO2/h
- Computer CO2 Emissions = Usage Hours * 0.04 CO2/h

### Food Data
Input: 
- No. of Meat Serving (100g): integer
- Type of Meat (beef/pork/chicken)
Calculation
- Beef CO2 Emissions = No. of serving * 2.5
- Pork CO2 Emissions = No. of serving * 0.7
- Chicken CO2 Emissions = No. of serving * 0.6




