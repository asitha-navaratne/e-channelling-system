from fastapi import APIRouter, Depends
from datetime import datetime, timedelta, timezone
from typing import Annotated
from starlette import status
from sqlalchemy.orm import Session

from .auth import get_current_user
from database.models import Appointment, Availability
from database.config import SessionLocal
from classes.CreateAppointmentRequest import CreateAppointmentRequest

from errors.auth_exceptions import authorization_exception
from errors.data_exceptions import time_not_available_exception, appointments_exceeded_exception, cancelation_window_exception, invalid_datetime_exception


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
token_dependency = Annotated[dict, Depends(get_current_user)]

router = APIRouter(
    prefix='/appointments',
    tags=['Appointments']
)

# Routes
@router.get('/')
async def get_all_appointments(token: token_dependency, db: db_dependency):
    if token['role'] == 'admin':
        appointments = db.query(Appointment).filter(Appointment.is_active == True).all()
    elif token['role'] == 'doctor':
        appointments = db.query(Appointment).filter(Appointment.doctor_id == token['id'], Appointment.is_active == True).all()
    else:
        appointments = db.query(Appointment).filter(Appointment.user_id == token['id'], Appointment.is_active == True).all()

    return {'appointments': appointments}

@router.post('/', status_code=status.HTTP_201_CREATED)
async def add_appointment(token: token_dependency, db: db_dependency, create_appointment_request: CreateAppointmentRequest):
    if token['role'] != 'user':
        raise authorization_exception
    
    if create_appointment_request.appointment_dttm < datetime.now(tz=timezone.utc):
        raise invalid_datetime_exception
    
    time_available = db.query(Availability).filter(Availability.start_time <= create_appointment_request.appointment_dttm, Availability.end_time > create_appointment_request.appointment_dttm, Availability.doctor_id == create_appointment_request.doctor_id).first()

    if not time_available:
        raise time_not_available_exception
    
    existing_appointments = db.query(Appointment).filter(Appointment.appointment_dttm >= time_available.start_time, Appointment.appointment_dttm <= time_available.end_time, Appointment.doctor_id == create_appointment_request.doctor_id).all()

    if len(existing_appointments) >= 10:
        raise appointments_exceeded_exception

    create_appointment_model = Appointment(
        user_id = token['id'],
        doctor_id = create_appointment_request.doctor_id,
        appointment_dttm = create_appointment_request.appointment_dttm,
        is_active = True,
        created_dttm = datetime.now(tz=timezone.utc),
    )

    db.add(create_appointment_model)
    db.commit()

    return {
        'number': len(existing_appointments) + 1,
        'time': create_appointment_request.appointment_dttm
    }

@router.patch('/{appointment_id}', status_code=status.HTTP_204_NO_CONTENT)
async def deactivate_appointment(token: token_dependency, db: db_dependency, appointment_id: int):
    appointment_model = db.query(Appointment).filter(Appointment.id == appointment_id).first()

    if token['role'] != 'user' and appointment_model.appointment_dttm - datetime.now(tz=timezone.utc) < timedelta(hours=48):    
        raise cancelation_window_exception

    appointment_model.is_active = False
        
    db.add(appointment_model)
    db.commit()