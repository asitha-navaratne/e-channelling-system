from pydantic import BaseModel


class ChangePasswordRequest(BaseModel):
    password: str
    new_password: str
    confirm_password: str