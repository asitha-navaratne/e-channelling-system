from fastapi import APIRouter, Depends
from datetime import datetime
from typing import Annotated
from pydantic import BaseModel
from starlette import status
from sqlalchemy.orm import Session

from .auth import get_current_user
from database.models import Availability
from database.config import SessionLocal
from errors.auth_exceptions import authorization_exception


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
    tags=['availability']
)

## Types
class CreateAvailabilityRequest(BaseModel):
    start_time: datetime
    end_time: datetime

## Routes
@router.get('/')
async def get_all_availability(token: token_dependency, db: db_dependency):
    if token['role'] != 'doctor':
        raise authorization_exception
    
    availability = db.query(Availability).filter(Availability.doctor_id == token['id']).all()

    return {'availability': availability}

@router.post('/', status_code=status.HTTP_201_CREATED)
async def add_availability(token: token_dependency, db: db_dependency, create_availability_request: CreateAvailabilityRequest):
    if token['role'] != 'doctor':
        raise authorization_exception

    create_availability_model = Availability(
        doctor_id = token['id'],
        start_time = create_availability_request.start_time,
        end_time = create_availability_request.end_time,
        created_dttm = datetime.now(),
    )

    db.add(create_availability_model)
    db.commit()