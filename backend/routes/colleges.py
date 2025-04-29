from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from models.user import College, Student
from routes.auth import get_current_user

router = APIRouter()

@router.post("/colleges/register", response_model=College)
async def register_college(
    name: str,
    address: str,
    services: List[str],
    marketing_agreement: bool = False,
    current_user: User = Depends(get_current_user)
):
    """Register a new college."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can register colleges")
        
    college = College(
        name=name,
        address=address,
        services=services,
        marketing_agreement=marketing_agreement,
        subscription_status="active"
    )
    college.save()
    return college

@router.post("/colleges/{college_id}/students", response_model=Student)
async def add_student(
    college_id: str,
    student_id: str,
    full_name: str,
    phone_number: str,
    department: str,
    year: str,
    current_user: User = Depends(get_current_user)
):
    """Add a new student to a college."""
    if current_user.role != "college":
        raise HTTPException(status_code=403, detail="Only colleges can add students")
        
    college = College.objects(id=college_id).first()
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
        
    # Generate email based on college domain
    email = f"{student_id}@{college.name.lower().replace(' ', '')}.edu"
    
    student = Student(
        college=college,
        student_id=student_id,
        full_name=full_name,
        phone_number=phone_number,
        department=department,
        year=year,
        email=email,
        role="student"
    )
    student.save()
    return student

@router.get("/colleges/{college_id}/students", response_model=List[Student])
async def get_college_students(
    college_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get all students of a college."""
    if current_user.role not in ["admin", "college"]:
        raise HTTPException(status_code=403, detail="Not authorized to view students")
        
    college = College.objects(id=college_id).first()
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
        
    students = Student.objects(college=college)
    return list(students)

@router.put("/colleges/{college_id}/services")
async def update_college_services(
    college_id: str,
    services: List[str],
    current_user: User = Depends(get_current_user)
):
    """Update services offered by a college."""
    if current_user.role != "college":
        raise HTTPException(status_code=403, detail="Only colleges can update services")
        
    college = College.objects(id=college_id).first()
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
        
    college.services = services
    college.save()
    return {"message": "Services updated successfully"}

@router.put("/colleges/{college_id}/subscription")
async def update_subscription(
    college_id: str,
    status: str,
    current_user: User = Depends(get_current_user)
):
    """Update college subscription status."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update subscription status")
        
    college = College.objects(id=college_id).first()
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
        
    college.subscription_status = status
    college.save()
    return {"message": "Subscription status updated successfully"} 