from pydantic import BaseModel


class CreateDoctorRequest(BaseModel):
    email: str
    first_name: str
    last_name: str
    field: str
    phone_number: str
    address: str
    nic: str
    password: str