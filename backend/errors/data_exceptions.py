from fastapi import HTTPException
from starlette import status


invalid_time_range_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail='Start time cannot be past the ending time.',
    headers={"WWW-Authenticate": "Bearer"},
)

time_slot_conflict_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail='Specified time slot overlaps with an existing availability slot.',
    headers={"WWW-Authenticate": "Bearer"},
)