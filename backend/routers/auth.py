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

from database.models import User
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

class Token(BaseModel):
    access_token: str
    token_type: str

## Helpers
def authenticate_user(email: str, password: str, db: db_dependency):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return False
    
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    
    return user

def create_access_token(email: str, user_id: int, expires_delta: timedelta):
    encode = {'sub': email, 'id': user_id}
    expires = datetime.utcnow() + expires_delta
    encode.update({'exp': expires})

    return jwt.encode(encode, os.getenv("SECRET_KEY"), algorithm = os.getenv('ALGORITHM'))

async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=[os.getenv('ALGORITHM')])
        email: str = payload.get('sub')
        user_id: int = payload.get('id')

        if email is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate credentials.')
        
        return {'email': email, 'id': user_id}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate credentials.')

## Routes
@router.post('/register', status_code = status.HTTP_201_CREATED)
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

@router.post('/login', response_model=Token)
async def get_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    user = authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate credentials.')
    
    token = create_access_token(user.email, user.id, timedelta(minutes=20))

    return {'access_token': token, 'token_type': 'bearer'}