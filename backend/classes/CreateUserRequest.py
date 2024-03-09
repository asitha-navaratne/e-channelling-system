from pydantic import BaseModel

from .Titles import Titles


class CreateUserRequest(BaseModel):
    email: str
    first_name: str
    last_name: str
    title: Titles
    phone_number: str
    address: str
    nic: str
    password: str