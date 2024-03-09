from pydantic import BaseModel
from datetime import datetime


class CreateAppointmentRequest(BaseModel):
    doctor_id: int
    appointment_dttm: datetime