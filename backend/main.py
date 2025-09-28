from fastapi import FastAPI
app = FastAPI(
    title="Carbon Health API",
    description="API for tracking personal carbon emissions."
)

@app.get('/')
def handle_request():
    return "Welcome to Carbon Health API"