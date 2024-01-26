from fastapi import APIRouter, Depends
from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from passlib.context import CryptContext
from typing import Annotated
from starlette import status
from sqlalchemy.orm import Session

from .auth import get_current_user
from database.models import User
from database.config import SessionLocal

from errors.auth_exceptions import authorization_exception


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

class EditUserRequest(BaseModel):
    phone_number: str
    email: str
    address: str

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
        created_dttm = datetime.utcnow(),
        updated_dttm = datetime.utcnow()
    )

    db.add(create_user_model)
    db.commit()

@router.put('/', status_code=status.HTTP_200_OK)
async def edit_user(db: db_dependency, token: token_dependency, edit_user_request: EditUserRequest):
    if token['role'] != 'user':
        raise authorization_exception

    user_model = db.query(User).filter(User.id == token['id']).first()

    user_model.email = edit_user_request.email
    user_model.phone_number = edit_user_request.phone_number
    user_model.address = edit_user_request.address
    user_model.updated_dttm = datetime.utcnow()

    db.add(user_model)
    db.commit()