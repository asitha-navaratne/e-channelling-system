from fastapi import APIRouter, Depends
from datetime import datetime
from typing import Annotated
from pydantic import BaseModel
from starlette import status
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from .auth import get_current_user
from database.models import Availability
from database.config import SessionLocal

from errors.auth_exceptions import authorization_exception
from errors.data_exceptions import invalid_time_range_exception, time_slot_conflict_exception


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

## Types
class CreateAvailabilityRequest(BaseModel):
    start_time: datetime
    end_time: datetime

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
    
    if create_availability_request.start_time > create_availability_request.end_time:
        raise invalid_time_range_exception
    
    time_slot_conflicts = db.query(Availability).filter(or_(and_(Availability.start_time <= create_availability_request.start_time, Availability.end_time > create_availability_request.start_time), and_(Availability.start_time < create_availability_request.end_time, Availability.end_time >= create_availability_request.end_time))).filter(Availability.doctor_id == token['id']).all()
    
    if time_slot_conflicts:
        raise time_slot_conflict_exception

    create_availability_model = Availability(
        doctor_id = token['id'],
        start_time = create_availability_request.start_time,
        end_time = create_availability_request.end_time,
        created_dttm = datetime.now(),
    )

    db.add(create_availability_model)
    db.commit()

@router.delete('/{availability_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_availability(token: token_dependency, db: db_dependency, availability_id: int):
    if token['role'] != 'doctor':
        raise authorization_exception
    
    db.query(Availability).filter(Availability.doctor_id == token['id']).filter(Availability.id == availability_id).delete()
    db.commit()