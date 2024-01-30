from fastapi import APIRouter, Depends
from pydantic import BaseModel
from datetime import datetime, timezone
from enum import Enum
from passlib.context import CryptContext
from typing import Annotated
from starlette import status
from sqlalchemy.orm import Session

from .auth import get_current_user
from database.models import User
from database.config import SessionLocal

from errors.auth_exceptions import authentication_exception, authorization_exception, password_mismatch_exception


router = APIRouter(
    prefix='/user',
    tags=['User']
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
    first_name: str
    last_name: str
    title: Titles
    phone_number: str
    address: str
    nic: str
    password: str

class ChangeUserRequest(BaseModel):
    phone_number: str
    email: str
    address: str

class ChangePasswordRequest(BaseModel):
    password: str
    new_password: str
    confirm_password: str

## Routes
@router.get('/')
async def get_details(db: db_dependency, token: token_dependency):
    if token['role'] == 'doctor':
        raise authorization_exception

    user = db.query(User).filter(User.id == token['id']).first()

    return {
        'title': user.title,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'address': user.address,
        'nic': user.nic,
        'phone_number': user.phone_number    
    }

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
        created_dttm = datetime.now(tz=timezone.utc),
        updated_dttm = datetime.now(tz=timezone.utc)
    )

    db.add(create_user_model)
    db.commit()

@router.patch('/', status_code=status.HTTP_200_OK)
async def edit_user(db: db_dependency, token: token_dependency, change_user_request: ChangeUserRequest):
    if token['role'] != 'user':
        raise authorization_exception

    user_model = db.query(User).filter(User.id == token['id']).first()

    user_model.email = change_user_request.email
    user_model.phone_number = change_user_request.phone_number
    user_model.address = change_user_request.address
    user_model.updated_dttm = datetime.now(tz=timezone.utc)

    db.add(user_model)
    db.commit()

@router.patch('/change-password', status_code=status.HTTP_200_OK)
async def change_password(db: db_dependency, token: token_dependency, change_password_request: ChangePasswordRequest):
    if token['role'] != 'user':
        raise authorization_exception
    
    user_model = db.query(User).filter(User.id == token['id']).first()

    if not bcrypt_context.verify(change_password_request.password, user_model.hashed_password):
        raise authentication_exception
    
    if change_password_request.new_password != change_password_request.confirm_password:
        raise password_mismatch_exception
    
    user_model.hashed_password = bcrypt_context.hash(change_password_request.new_password)
    user_model.updated_dttm = datetime.now(tz=timezone.utc)
    
    db.add(user_model)
    db.commit()