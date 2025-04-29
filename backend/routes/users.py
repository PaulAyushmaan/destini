from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from models.user import User, Student, Driver, NormalUser
from routes.auth import get_current_user
from config.security import get_password_hash

router = APIRouter()

@router.get("/users/me", response_model=User)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile."""
    return current_user

@router.put("/users/me/profile")
async def update_user_profile(
    full_name: str = None,
    phone_number: str = None,
    address: str = None,
    current_user: User = Depends(get_current_user)
):
    """Update current user's profile."""
    if full_name:
        current_user.full_name = full_name
    if phone_number:
        current_user.phone_number = phone_number
    if address and isinstance(current_user, (NormalUser, Student)):
        current_user.address = address
        
    current_user.save()
    return {"message": "Profile updated successfully"}

@router.put("/users/me/password")
async def update_password(
    current_password: str,
    new_password: str,
    current_user: User = Depends(get_current_user)
):
    """Update user's password."""
    if not verify_password(current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
        
    current_user.password_hash = get_password_hash(new_password)
    current_user.save()
    return {"message": "Password updated successfully"}

@router.get("/users/me/rides", response_model=List[Ride])
async def get_user_rides(
    status: str = None,
    current_user: User = Depends(get_current_user)
):
    """Get all rides for the current user."""
    query = {"user": current_user}
    if status:
        query["status"] = status
        
    rides = Ride.objects(**query)
    return list(rides)

@router.get("/users/me/rides/{ride_id}", response_model=Ride)
async def get_user_ride(
    ride_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific ride for the current user."""
    ride = Ride.objects(id=ride_id, user=current_user).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    return ride

@router.post("/users/me/rides/{ride_id}/cancel")
async def cancel_ride(
    ride_id: str,
    current_user: User = Depends(get_current_user)
):
    """Cancel a ride."""
    ride = Ride.objects(id=ride_id, user=current_user).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
        
    if ride.status not in ["pending", "accepted"]:
        raise HTTPException(status_code=400, detail="Cannot cancel ride in current status")
        
    ride.status = "cancelled"
    ride.save()
    
    # If ride was accepted, make driver available again
    if ride.status == "accepted" and ride.driver:
        driver = ride.driver
        driver.is_available = True
        driver.save()
        
    return {"message": "Ride cancelled successfully"}

@router.post("/users/me/rides/{ride_id}/rate")
async def rate_ride(
    ride_id: str,
    rating: float,
    comment: str = None,
    current_user: User = Depends(get_current_user)
):
    """Rate a completed ride."""
    ride = Ride.objects(id=ride_id, user=current_user).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
        
    if ride.status != "completed":
        raise HTTPException(status_code=400, detail="Can only rate completed rides")
        
    if not ride.driver:
        raise HTTPException(status_code=400, detail="No driver assigned to this ride")
        
    # Update driver's rating
    driver = ride.driver
    current_rating = float(driver.rating)
    num_ratings = len(driver.rides)
    new_rating = ((current_rating * num_ratings) + rating) / (num_ratings + 1)
    driver.rating = str(round(new_rating, 1))
    driver.save()
    
    return {"message": "Ride rated successfully"} 