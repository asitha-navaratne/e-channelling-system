import os
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel
from datetime import datetime, timedelta
from passlib.context import CryptContext
from typing import Annotated
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from dotenv import load_dotenv

from database.models import User, Doctor
from database.config import SessionLocal

from errors.auth_exceptions import credential_exception, authentication_exception


load_dotenv()

router = APIRouter(
    prefix='/auth',
    tags=['Auth']
)

ACCESS_TOKEN_EXPIRE_MINUTES = 30

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='auth/token')

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

## Types
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

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=[os.getenv('ALGORITHM')])
        email: str = payload.get('sub')
        user_id: int = payload.get('id')
        user_role: str = payload.get('role')

        if email is None or user_id is None:
            raise credential_exception

        return {'email': email, 'id': user_id, 'role': user_role}
    except JWTError:
        raise credential_exception

## Routes
@router.post('/token', response_model=Token)
async def get_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    details = authenticate(form_data.username, form_data.password, db)

    if not details:
        raise authentication_exception
    
    token = create_access_token(details['email'], details['id'], details['user_role'], timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

    return Token(access_token=token, token_type='bearer')