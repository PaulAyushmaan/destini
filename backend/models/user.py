from mongoengine import Document, StringField, EmailField, BooleanField, ListField, ReferenceField, DateTimeField
from datetime import datetime
from typing import Optional

class User(Document):
    email = EmailField(required=True, unique=True)
    password_hash = StringField(required=True)
    role = StringField(required=True, choices=["admin", "college", "student", "driver", "normal_user"])
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        "allow_inheritance": True,
        "collection": "users"
    }

class College(User):
    name = StringField(required=True)
    address = StringField(required=True)
    services = ListField(StringField(choices=["cab", "toto", "auto", "moto", "cycle", "e_bike"]))
    subscription_status = StringField(choices=["active", "inactive"], default="inactive")
    marketing_agreement = BooleanField(default=False)

class Student(User):
    college = ReferenceField(College, required=True)
    student_id = StringField(required=True)
    full_name = StringField(required=True)
    phone_number = StringField(required=True)
    department = StringField()
    year = StringField()

class Driver(User):
    full_name = StringField(required=True)
    phone_number = StringField(required=True)
    license_number = StringField(required=True)
    vehicle_type = StringField(required=True, choices=["cab", "toto", "auto", "moto"])
    vehicle_number = StringField(required=True)
    is_available = BooleanField(default=True)
    current_location = StringField()
    rating = StringField(default="0.0")

class NormalUser(User):
    full_name = StringField(required=True)
    phone_number = StringField(required=True)
    address = StringField() 