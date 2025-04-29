from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from models.user import Driver
from models.ride import RealTimeRide
from routes.auth import get_current_user
from utils.geocoding import GeocodingService

router = APIRouter()
geocoding = GeocodingService()

@router.post("/drivers/register", response_model=Driver)
async def register_driver(
    full_name: str,
    phone_number: str,
    license_number: str,
    vehicle_type: str,
    vehicle_number: str,
    current_user: User = Depends(get_current_user)
):
    """Register a new driver."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can register drivers")
        
    driver = Driver(
        full_name=full_name,
        phone_number=phone_number,
        license_number=license_number,
        vehicle_type=vehicle_type,
        vehicle_number=vehicle_number,
        is_available=True,
        role="driver"
    )
    driver.save()
    return driver

@router.put("/drivers/{driver_id}/location")
async def update_driver_location(
    driver_id: str,
    location: str,
    current_user: User = Depends(get_current_user)
):
    """Update driver's current location."""
    if current_user.role != "driver":
        raise HTTPException(status_code=403, detail="Only drivers can update location")
        
    driver = Driver.objects(id=driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
        
    driver.current_location = location
    driver.save()
    return {"message": "Location updated successfully"}

@router.put("/drivers/{driver_id}/availability")
async def update_driver_availability(
    driver_id: str,
    is_available: bool,
    current_user: User = Depends(get_current_user)
):
    """Update driver's availability status."""
    if current_user.role != "driver":
        raise HTTPException(status_code=403, detail="Only drivers can update availability")
        
    driver = Driver.objects(id=driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
        
    driver.is_available = is_available
    driver.save()
    return {"message": "Availability updated successfully"}

@router.get("/drivers/{driver_id}/rides", response_model=List[RealTimeRide])
async def get_driver_rides(
    driver_id: str,
    status: str = None,
    current_user: User = Depends(get_current_user)
):
    """Get rides assigned to a driver."""
    if current_user.role != "driver":
        raise HTTPException(status_code=403, detail="Only drivers can view their rides")
        
    driver = Driver.objects(id=driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
        
    query = {"driver": driver}
    if status:
        query["status"] = status
        
    rides = RealTimeRide.objects(**query)
    return list(rides)

@router.post("/drivers/{driver_id}/rides/{ride_id}/accept")
async def accept_ride(
    driver_id: str,
    ride_id: str,
    current_user: User = Depends(get_current_user)
):
    """Accept a ride request."""
    if current_user.role != "driver":
        raise HTTPException(status_code=403, detail="Only drivers can accept rides")
        
    driver = Driver.objects(id=driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
        
    ride = RealTimeRide.objects(id=ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
        
    if ride.status != "pending":
        raise HTTPException(status_code=400, detail="Ride is not available for acceptance")
        
    ride.driver = driver
    ride.status = "accepted"
    driver.is_available = False
    ride.save()
    driver.save()
    
    return {"message": "Ride accepted successfully"}

@router.post("/drivers/{driver_id}/rides/{ride_id}/complete")
async def complete_ride(
    driver_id: str,
    ride_id: str,
    current_user: User = Depends(get_current_user)
):
    """Mark a ride as completed."""
    if current_user.role != "driver":
        raise HTTPException(status_code=403, detail="Only drivers can complete rides")
        
    driver = Driver.objects(id=driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
        
    ride = RealTimeRide.objects(id=ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
        
    if ride.status != "in_progress":
        raise HTTPException(status_code=400, detail="Ride is not in progress")
        
    ride.status = "completed"
    driver.is_available = True
    ride.save()
    driver.save()
    
    return {"message": "Ride completed successfully"} 