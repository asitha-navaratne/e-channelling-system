from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from passlib.context import CryptContext

from database.models import User


router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

class Titles(Enum):
    mr = 'Mr.'
    mrs = 'Mrs.'
    ms = 'Ms.'
    master = 'Master'
    miss = 'Miss'
    dr = 'Dr.'
    rev = 'Rev'

class UserRoles(Enum):
    admin = 'admin'
    user = 'user'

class CreateUserRequest(BaseModel):
    email: str
    title: Titles
    first_name: str
    last_name: str
    phone_number: str
    address: str
    nic: str
    user_role: UserRoles
    password: str

@router.post('/')
async def create_user(create_user_request: CreateUserRequest):
    create_user_model = User(
        email = create_user_request.email,
        title = create_user_request.title,
        first_name = create_user_request.first_name,
        last_name = create_user_request.last_name,
        phone_number = create_user_request.phone_number,
        address = create_user_request.address,
        nic = create_user_request.nic,
        user_role = create_user_request.user_role,
        hashed_password = bcrypt_context.hash(create_user_request.password),
        created_dttm = datetime.now(),
        updated_dttm = datetime.now()
    )

    return create_user_model