from pydantic import BaseModel
from datetime import datetime


class CreateAvailabilityRequest(BaseModel):
    start_time: datetime
    end_time: datetime