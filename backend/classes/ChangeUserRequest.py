from pydantic import BaseModel


class ChangeUserRequest(BaseModel):
    phone_number: str
    email: str
    address: str