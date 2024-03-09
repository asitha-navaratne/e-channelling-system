from fastapi import APIRouter, Depends
from datetime import datetime, timezone
from typing import Annotated
from starlette import status
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from .auth import get_current_user
from database.models import Availability, Appointment
from database.config import SessionLocal
from classes.CreateAvailabilityRequest import CreateAvailabilityRequest

from errors.auth_exceptions import authorization_exception
from errors.data_exceptions import invalid_time_range_exception, time_slot_conflict_exception, existing_appointment_conflict_exception, invalid_datetime_exception


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
token_dependency = Annotated[dict, Depends(get_current_user)]

router = APIRouter(
    prefix='/availability',
    tags=['Availability']
)

## Routes
@router.get('/')
async def get_availability_for_doctor(token: token_dependency, db: db_dependency):
    if token['role'] != 'doctor':
        raise authorization_exception
    
    availability = db.query(Availability).filter(Availability.doctor_id == token['id']).all()

    return {'availability': availability}

@router.get('/{doctor_id}')
async def get_availability_by_doctor_id(token: token_dependency, db: db_dependency, doctor_id: int):
    availability = db.query(Availability).filter(Availability.doctor_id == doctor_id).all()

    return {'availability': availability}

@router.post('/', status_code=status.HTTP_201_CREATED)
async def add_availability(token: token_dependency, db: db_dependency, create_availability_request: CreateAvailabilityRequest):
    if token['role'] != 'doctor':
        raise authorization_exception
    
    if create_availability_request.start_time < datetime.now(tz=timezone.utc):
        raise invalid_datetime_exception
    
    if create_availability_request.start_time > create_availability_request.end_time:
        raise invalid_time_range_exception
    
    # Check if an availability slot already exists in the time range provided by the user. Checks if
    #   - Provided start time >= time slot's start time AND provided start time < time slot's end time OR
    #   - Provided end time > time slot's start time AND provided end time >= time slot's end time
    time_slot_conflicts = db.query(Availability).filter(or_(and_(Availability.start_time <= create_availability_request.start_time, Availability.end_time > create_availability_request.start_time), and_(Availability.start_time < create_availability_request.end_time, Availability.end_time >= create_availability_request.end_time))).filter(Availability.doctor_id == token['id']).all()
    
    if time_slot_conflicts:
        raise time_slot_conflict_exception

    create_availability_model = Availability(
        doctor_id = token['id'],
        start_time = create_availability_request.start_time,
        end_time = create_availability_request.end_time,
        created_dttm = datetime.now(tz=timezone.utc),
    )

    db.add(create_availability_model)
    db.commit()

@router.delete('/{availability_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_availability(token: token_dependency, db: db_dependency, availability_id: int):
    if token['role'] != 'doctor':
        raise authorization_exception
    
    availability_model = db.query(Availability).filter(Availability.id == availability_id, Availability.doctor_id == token['id']).first()

    appointments = db.query(Appointment).filter(Appointment.appointment_dttm >= availability_model.start_time, Appointment.appointment_dttm < availability_model.end_time).all()

    if appointments:
        raise existing_appointment_conflict_exception
    
    availability_model.delete()
    db.commit()