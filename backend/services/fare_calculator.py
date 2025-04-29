from typing import Dict, List
from models.user import User
from models.ride import Ride

class FareCalculator:
    # Base rates per kilometer for different vehicle types
    BASE_RATES = {
        "cab": 15,  # Rs/km
        "toto": 10,
        "auto": 12,
        "moto": 8,
        "shuttle": 5,
        "bike": 0  # Free for students during specific hours
    }
    
    # Minimum fare for different vehicle types
    MINIMUM_FARE = {
        "cab": 100,
        "toto": 50,
        "auto": 60,
        "moto": 40,
        "shuttle": 30,
        "bike": 0
    }
    
    def calculate_base_fare(self, distance: float, vehicle_type: str) -> float:
        """Calculate base fare based on distance and vehicle type."""
        base_rate = self.BASE_RATES.get(vehicle_type, 0)
        minimum_fare = self.MINIMUM_FARE.get(vehicle_type, 0)
        
        fare = distance * base_rate
        return max(fare, minimum_fare)
        
    def apply_discounts(self, fare: float, user: User, ride: Ride) -> float:
        """Apply applicable discounts to the fare."""
        # 50% discount for students
        if user.role == "student":
            fare *= 0.5
            
        # Additional discounts for shared rides
        if isinstance(ride, RealTimeRide) and ride.is_shared:
            fare *= 0.8  # 20% discount for shared rides
            
        return round(fare, 2)
        
    def calculate_fare(self, distance: float, vehicle_type: str, user: User, ride: Ride) -> float:
        """Calculate final fare with all applicable discounts."""
        base_fare = self.calculate_base_fare(distance, vehicle_type)
        final_fare = self.apply_discounts(base_fare, user, ride)
        return final_fare
        
    def split_fare(self, fare: float, users: List[User], distances: List[float]) -> Dict[str, float]:
        """Split fare among multiple users based on their travel distances."""
        total_distance = sum(distances)
        if total_distance == 0:
            return {str(user.id): fare / len(users) for user in users}
            
        split_fares = {}
        for user, distance in zip(users, distances):
            user_share = (distance / total_distance) * fare
            split_fares[str(user.id)] = round(user_share, 2)
            
        return split_fares 