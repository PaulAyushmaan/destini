from typing import List, Optional
from models.ride import RealTimeRide
from models.user import Driver
from utils.geocoding import GeocodingService
import math

class RideMatchingService:
    def __init__(self):
        self.geocoding = GeocodingService()
        
    def calculate_driver_score(self, driver: Driver, ride: RealTimeRide) -> float:
        """Calculate a score for driver-ride matching based on various factors."""
        # Get coordinates for driver and pickup location
        driver_coords = self.geocoding.get_coordinates(driver.current_location)
        pickup_coords = self.geocoding.get_coordinates(ride.pickup_location)
        
        if not driver_coords or not pickup_coords:
            return 0.0
            
        # Calculate distance score (closer is better)
        distance = self.geocoding.calculate_distance(driver_coords, pickup_coords)
        distance_score = max(0, 1 - (distance / 10))  # Normalize to 0-1 range
        
        # Rating score (higher rating is better)
        rating_score = float(driver.rating) / 5.0
        
        # Vehicle type match score
        vehicle_match_score = 1.0 if driver.vehicle_type == ride.ride_type else 0.5
        
        # Calculate final score (weighted average)
        final_score = (
            distance_score * 0.4 +  # Distance is most important
            rating_score * 0.3 +    # Rating is second most important
            vehicle_match_score * 0.3
        )
        
        return final_score
        
    def find_best_driver(self, ride: RealTimeRide) -> Optional[Driver]:
        """Find the best available driver for a ride request."""
        # Get all available drivers with matching vehicle type
        available_drivers = Driver.objects(
            is_available=True,
            vehicle_type=ride.ride_type
        )
        
        if not available_drivers:
            return None
            
        # Calculate scores for all available drivers
        driver_scores = [
            (driver, self.calculate_driver_score(driver, ride))
            for driver in available_drivers
        ]
        
        # Sort by score and return the best match
        driver_scores.sort(key=lambda x: x[1], reverse=True)
        return driver_scores[0][0] if driver_scores else None
        
    def match_ride(self, ride: RealTimeRide) -> Optional[Driver]:
        """Match a ride request with the best available driver."""
        best_driver = self.find_best_driver(ride)
        
        if best_driver:
            # Update driver's availability
            best_driver.is_available = False
            best_driver.save()
            
            # Update ride with matched driver
            ride.driver = best_driver
            ride.status = "accepted"
            ride.save()
            
        return best_driver 