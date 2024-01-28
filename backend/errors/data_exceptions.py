from fastapi import HTTPException
from starlette import status


invalid_time_range_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail='Start time cannot be past the ending time. Please choose an ending time past the specified start time',
    headers={"WWW-Authenticate": "Bearer"},
)

time_slot_conflict_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail='Specified time slot overlaps with an existing availability slot. Please choose a time period that has not already been booked.',
    headers={"WWW-Authenticate": "Bearer"},
)

time_not_available_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail='Specified doctor is not available at the given time. Please choose another time slot.',
    headers={"WWW-Authenticate": "Bearer"},
)

appointments_exceeded_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail='Specified doctor has exceeded the number of appointments for the given time. Please choose another time slot.',
    headers={"WWW-Authenticate": "Bearer"},
)

cancelation_window_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail='Appointments can only be cancelled before 48 hours from the appointment time.',
    headers={"WWW-Authenticate": "Bearer"},
)