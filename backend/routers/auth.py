import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel
from datetime import datetime, timedelta
from enum import Enum
from passlib.context import CryptContext
from typing import Annotated
from starlette import status
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from dotenv import load_dotenv

from database.models import User, Doctor
from database.config import SessionLocal


load_dotenv()

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/login')

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

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
    title: Titles
    first_name: str
    last_name: str
    phone_number: str
    address: str
    nic: str
    password: str

class CreateDoctorRequest(BaseModel):
    email: str
    first_name: str
    last_name: str
    field: str
    phone_number: str
    address: str
    nic: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

## Helpers
def authenticate(email: str, password: str, db: db_dependency):
    user = db.query(User).filter(User.email == email).first()

    if user and bcrypt_context.verify(password, user.hashed_password):
        return {'email': user.email, 'id': user.id, 'user_role': user.user_role}
        
    doctor = db.query(Doctor).filter(Doctor.email == email).first()
        
    if doctor and bcrypt_context.verify(password, doctor.hashed_password):
        return {'email': doctor.email, 'id': doctor.id, 'user_role': 'doctor'}
    
    return False

def create_access_token(email: str, user_id: int, user_role: str, expires_delta: timedelta):
    encode = {'sub': email, 'id': user_id, 'role': user_role}
    expires = datetime.utcnow() + expires_delta
    encode.update({'exp': expires})

    return jwt.encode(encode, os.getenv("SECRET_KEY"), algorithm = os.getenv('ALGORITHM'))

async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=[os.getenv('ALGORITHM')])
        email: str = payload.get('sub')
        user_id: int = payload.get('id')
        user_role: str = payload.get('role')

        if email is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate credentials.')
        
        return {'email': email, 'id': user_id, 'role': user_role}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate credentials.')

## Routes
@router.post('/user/register', status_code = status.HTTP_201_CREATED)
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

@router.post('/doctor/register', status_code=status.HTTP_201_CREATED)
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

@router.post('/login', response_model=Token)
async def get_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    details = authenticate(form_data.username, form_data.password, db)

    if not details:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate credentials.')
    
    token = create_access_token(details['email'], details['id'], details['user_role'], timedelta(minutes=20))

    return {'access_token': token, 'token_type': 'bearer'}