from fastapi import APIRouter, Depends
from pydantic import BaseModel
from datetime import datetime
from passlib.context import CryptContext
from typing import Annotated
from starlette import status
from sqlalchemy.orm import Session

from .auth import get_current_user
from database.models import Doctor
from database.config import SessionLocal

from errors.auth_exceptions import authentication_exception, authorization_exception, password_mismatch_exception


router = APIRouter(
    prefix='/doctor',
    tags=['Doctor']
)

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
token_dependency = Annotated[dict, Depends(get_current_user)]

## Types
class CreateDoctorRequest(BaseModel):
    email: str
    first_name: str
    last_name: str
    field: str
    phone_number: str
    address: str
    nic: str
    password: str

class EditDoctorRequest(BaseModel):
    phone_number: str
    email: str
    password: str
    new_password: str
    confirm_password: str

## Routes
@router.get('/')
async def get_doctor_details(db: db_dependency, token: Annotated[dict, Depends(get_current_user)]):
    if token['role'] == 'user':
        raise authorization_exception

    doctor = db.query(Doctor).filter(Doctor.id == token['id']).first()

    return {
        'first_name': doctor.first_name,
        'last_name': doctor.last_name,
        'field': doctor.field,
        'address': doctor.address,
        'nic': doctor.nic,
        'phone_number': doctor.phone_number
    }

@router.post('/', status_code=status.HTTP_201_CREATED)
async def create_doctor(db: db_dependency, create_doctor_request: CreateDoctorRequest):
    create_doctor_model = Doctor(
        email = create_doctor_request.email,
        first_name = create_doctor_request.first_name,
        last_name = create_doctor_request.last_name,
        field = create_doctor_request.field,
        phone_number = create_doctor_request.phone_number,
        address = create_doctor_request.address,
        nic = create_doctor_request.nic,
        hashed_password = bcrypt_context.hash(create_doctor_request.password),
        created_dttm = datetime.utcnow(),
        updated_dttm = datetime.utcnow()
    )
    
    db.add(create_doctor_model)
    db.commit()

@router.put('/', status_code=status.HTTP_200_OK)
async def edit_doctor(db: db_dependency, token: Annotated[dict, Depends(get_current_user)], edit_doctor_request: EditDoctorRequest):
    if token['role'] != 'doctor':
        raise authorization_exception

    doctor_model = db.query(Doctor).filter(Doctor.id == token['id']).first()

    if not bcrypt_context.verify(edit_doctor_request.password, doctor_model.hashed_password):
        raise authentication_exception

    if edit_doctor_request.new_password != edit_doctor_request.confirm_password:
        raise password_mismatch_exception
    
    doctor_model.email = edit_doctor_request.email
    doctor_model.phone_number = edit_doctor_request.phone_number
    doctor_model.hashed_password = bcrypt_context.hash(edit_doctor_request.new_password)
    doctor_model.updated_dttm = datetime.utcnow()

    db.add(doctor_model)
    db.commit()