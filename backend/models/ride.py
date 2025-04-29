from mongoengine import Document, StringField, ReferenceField, DateTimeField, FloatField, BooleanField, ListField, DictField
from datetime import datetime
from typing import Optional

class Ride(Document):
    ride_type = StringField(required=True, choices=["cab", "toto", "auto", "moto", "shuttle", "bike"])
    status = StringField(required=True, choices=["pending", "accepted", "in_progress", "completed", "cancelled"])
    pickup_location = StringField(required=True)
    dropoff_location = StringField(required=True)
    distance = FloatField()  # in kilometers
    fare = FloatField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        "allow_inheritance": True,
        "collection": "rides"
    }

class RealTimeRide(Ride):
    user = ReferenceField("User", required=True)
    driver = ReferenceField("Driver")
    scheduled_time = DateTimeField()
    is_shared = BooleanField(default=False)
    shared_users = ListField(ReferenceField("User"))
    shared_fares = DictField()  # {user_id: fare_amount}
    bargaining_history = ListField(DictField())  # [{user: offer, driver: counter_offer, status}]

class ShuttleRide(Ride):
    route = StringField(required=True, choices=["A", "B", "C"])
    college = ReferenceField("College", required=True)
    scheduled_time = DateTimeField(required=True)
    capacity = IntField(required=True)
    booked_seats = IntField(default=0)
    passengers = ListField(ReferenceField("User"))

class BikeRide(Ride):
    user = ReferenceField("User", required=True)
    bike_type = StringField(required=True, choices=["cycle", "e_bike"])
    start_time = DateTimeField(required=True)
    end_time = DateTimeField()
    is_free = BooleanField(default=False)  # For specific time slots 