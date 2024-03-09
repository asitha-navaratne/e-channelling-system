from fastapi import HTTPException
from starlette import status


credential_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST, 
    detail='Could not validate credentials.',
    headers={"WWW-Authenticate": "Bearer"},
)

incorrect_details_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED, 
    detail='Incorrect username or password.',
    headers={"WWW-Authenticate": "Bearer"},
)

authorization_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN, 
    detail='User is not authorized to perform this action.',
    headers={"WWW-Authenticate": "Bearer"},
)

password_mismatch_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST, 
    detail='New passwords do not match. Please make sure the new password and confirmation match.',
    headers={"WWW-Authenticate": "Bearer"},
)

email_exists_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST, 
    detail='Email already exists.',
    headers={"WWW-Authenticate": "Bearer"},
)

empty_fields_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST, 
    detail='Fields cannot be empty.',
    headers={"WWW-Authenticate": "Bearer"},
)

phone_number_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST, 
    detail='Phone number must be 9 digits in length.',
    headers={"WWW-Authenticate": "Bearer"},
)