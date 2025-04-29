from geopy.geocoders import Nominatim
from geopy.distance import geodesic
from typing import Tuple, Optional, Dict
import time

class GeocodingService:
    def __init__(self):
        self.geolocator = Nominatim(user_agent="destini_cab_service")
        
    def get_coordinates(self, address: str) -> Optional[Tuple[float, float]]:
        """Get latitude and longitude for an address."""
        try:
            location = self.geolocator.geocode(address)
            if location:
                return (location.latitude, location.longitude)
            return None
        except Exception as e:
            print(f"Geocoding error: {e}")
            return None
            
    def get_address(self, latitude: float, longitude: float) -> Optional[str]:
        """Get address from coordinates."""
        try:
            location = self.geolocator.reverse(f"{latitude}, {longitude}")
            return location.address if location else None
        except Exception as e:
            print(f"Reverse geocoding error: {e}")
            return None
            
    def calculate_distance(self, point1: Tuple[float, float], point2: Tuple[float, float]) -> float:
        """Calculate distance between two points in kilometers."""
        return geodesic(point1, point2).kilometers
        
    def get_route_info(self, origin: str, destination: str) -> Dict:
        """Get comprehensive route information including distance and estimated time."""
        origin_coords = self.get_coordinates(origin)
        dest_coords = self.get_coordinates(destination)
        
        if not origin_coords or not dest_coords:
            return {"error": "Could not geocode locations"}
            
        distance = self.calculate_distance(origin_coords, dest_coords)
        # Rough estimate: 30 km/h average speed in city traffic
        estimated_time = distance / 30 * 60  # in minutes
        
        return {
            "distance_km": round(distance, 2),
            "estimated_time_minutes": round(estimated_time),
            "origin_coordinates": origin_coords,
            "destination_coordinates": dest_coords
        } 