from pydantic import BaseModel


class ChangeDoctorRequest(BaseModel):
    phone_number: str
    email: str