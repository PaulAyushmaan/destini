from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from models.ride import Ride, RealTimeRide, ShuttleRide, BikeRide
from models.user import User
from services.ride_matching import RideMatchingService
from services.fare_calculator import FareCalculator
from services.payment import PaymentService
from utils.geocoding import GeocodingService
from routes.auth import get_current_user

router = APIRouter()
ride_matching = RideMatchingService()
fare_calculator = FareCalculator()
payment_service = PaymentService()
geocoding = GeocodingService()

@router.post("/rides/real-time", response_model=RealTimeRide)
async def create_real_time_ride(
    pickup_location: str,
    dropoff_location: str,
    ride_type: str,
    is_shared: bool = False,
    current_user: User = Depends(get_current_user)
):
    """Create a new real-time ride request."""
    # Get route information
    route_info = geocoding.get_route_info(pickup_location, dropoff_location)
    if "error" in route_info:
        raise HTTPException(status_code=400, detail=route_info["error"])
        
    # Calculate fare
    fare = fare_calculator.calculate_fare(
        route_info["distance_km"],
        ride_type,
        current_user,
        RealTimeRide()
    )
    
    # Create ride
    ride = RealTimeRide(
        user=current_user,
        ride_type=ride_type,
        pickup_location=pickup_location,
        dropoff_location=dropoff_location,
        distance=route_info["distance_km"],
        fare=fare,
        is_shared=is_shared,
        status="pending"
    )
    ride.save()
    
    # Try to match with a driver
    matched_driver = ride_matching.match_ride(ride)
    
    return ride

@router.post("/rides/shuttle", response_model=ShuttleRide)
async def create_shuttle_ride(
    route: str,
    scheduled_time: datetime,
    college_id: str,
    current_user: User = Depends(get_current_user)
):
    """Create a new shuttle ride booking."""
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can book shuttle rides")
        
    ride = ShuttleRide(
        user=current_user,
        route=route,
        scheduled_time=scheduled_time,
        college=college_id,
        status="pending"
    )
    ride.save()
    return ride

@router.post("/rides/bike", response_model=BikeRide)
async def create_bike_ride(
    bike_type: str,
    start_time: datetime,
    current_user: User = Depends(get_current_user)
):
    """Create a new bike rental request."""
    ride = BikeRide(
        user=current_user,
        bike_type=bike_type,
        start_time=start_time,
        status="pending"
    )
    ride.save()
    return ride

@router.get("/rides/{ride_id}", response_model=Ride)
async def get_ride(ride_id: str, current_user: User = Depends(get_current_user)):
    """Get ride details by ID."""
    ride = Ride.objects(id=ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
        
    # Check if user has permission to view this ride
    if str(ride.user.id) != str(current_user.id) and current_user.role not in ["admin", "driver"]:
        raise HTTPException(status_code=403, detail="Not authorized to view this ride")
        
    return ride

@router.post("/rides/{ride_id}/bargain")
async def bargain_ride(
    ride_id: str,
    offer: float,
    current_user: User = Depends(get_current_user)
):
    """Submit a bargaining offer for a ride."""
    ride = RealTimeRide.objects(id=ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
        
    if ride.status != "pending":
        raise HTTPException(status_code=400, detail="Cannot bargain on a completed ride")
        
    # Add bargaining history
    ride.bargaining_history.append({
        "user": str(current_user.id),
        "offer": offer,
        "timestamp": datetime.utcnow()
    })
    ride.save()
    
    return {"message": "Bargaining offer submitted"}

@router.post("/rides/{ride_id}/split")
async def split_fare(
    ride_id: str,
    user_ids: List[str],
    current_user: User = Depends(get_current_user)
):
    """Split fare among multiple users."""
    ride = RealTimeRide.objects(id=ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
        
    if not ride.is_shared:
        raise HTTPException(status_code=400, detail="Cannot split fare on a non-shared ride")
        
    # Get all users
    users = [User.objects(id=user_id).first() for user_id in user_ids]
    if not all(users):
        raise HTTPException(status_code=400, detail="Invalid user IDs")
        
    # Calculate split fares
    split_fares = fare_calculator.split_fare(ride.fare, users, [ride.distance] * len(users))
    
    # Update ride with split fares
    ride.shared_fares = split_fares
    ride.save()
    
    return {"split_fares": split_fares} 