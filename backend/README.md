# Destini Cab Service - Backend

This is the backend service for the Destini Cab Service platform, built with FastAPI and MongoDB.

## Features

- Role-based authentication (admin, college, student, driver, normal_user)
- Real-time ride booking and matching
- Scheduled shuttle services
- Bike rental system
- Fare splitting and bargaining system
- College-specific services and discounts

## Tech Stack

- FastAPI
- MongoDB with MongoEngine
- JWT Authentication
- OpenStreetMap API
- Python 3.8+

## Setup

1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Configure environment variables:

- Copy `.env.example` to `.env`
- Update the values in `.env` with your configuration

4. Start MongoDB:

- Make sure MongoDB is running on the configured URL

5. Run the application:

```bash
uvicorn main:app --reload
```

## API Documentation

Once the server is running, visit:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── main.py                 # Application entry point
├── config/                 # Configuration files
│   ├── settings.py         # Application settings
│   └── security.py         # Security utilities
├── models/                 # Database models
│   ├── user.py            # User models
│   └── ride.py            # Ride models
├── routes/                 # API routes
│   ├── auth.py            # Authentication routes
│   ├── rides.py           # Ride management routes
│   ├── users.py           # User management routes
│   ├── colleges.py        # College management routes
│   └── drivers.py         # Driver management routes
├── services/              # Business logic
├── repository/            # Database operations
└── utils/                 # Utility functions
```

## Authentication

The API uses JWT tokens for authentication. To access protected endpoints:

1. Login to get tokens:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=email@example.com&password=your_password"
```

2. Use the access token in subsequent requests:

```bash
curl -X GET "http://localhost:8000/api/v1/protected" \
     -H "Authorization: Bearer your_access_token"
```

## Testing

Run tests with:

```bash
pytest
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
