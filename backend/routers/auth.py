from fastapi import APIRouter, Depends
from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from passlib.context import CryptContext
from typing import Annotated
from starlette import status
from sqlalchemy.orm import Session

from database.models import User
from database.config import SessionLocal


router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

class Titles(Enum):
    mr = 'Mr.'
    mrs = 'Mrs.'
    ms = 'Ms.'
    master = 'Master'
    miss = 'Miss'
    dr = 'Dr.'
    rev = 'Rev'

class CreateUserRequest(BaseModel):
    email: str
    title: Titles
    first_name: str
    last_name: str
    phone_number: str
    address: str
    nic: str
    password: str

@router.post('/', status_code = status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: CreateUserRequest):
    create_user_model = User(
        email = create_user_request.email,
        title = create_user_request.title.value,
        first_name = create_user_request.first_name,
        last_name = create_user_request.last_name,
        phone_number = create_user_request.phone_number,
        address = create_user_request.address,
        nic = create_user_request.nic,
        user_role = 'user',
        hashed_password = bcrypt_context.hash(create_user_request.password),
        created_dttm = datetime.now(),
        updated_dttm = datetime.now()
    )

    db.add(create_user_model)
    db.commit()