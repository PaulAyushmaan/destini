from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mongoengine import connect
from config.settings import settings
from routes import auth, rides, users, colleges, drivers

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MongoDB
connect(
    db=settings.MONGODB_DB_NAME,
    host=settings.MONGODB_URL
)

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(rides.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(colleges.router, prefix=settings.API_V1_STR)
app.include_router(drivers.router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Welcome to Destini Cab Service API"} 