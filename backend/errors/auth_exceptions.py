from fastapi import HTTPException
from starlette import status


credential_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST, 
    detail='Could not validate credentials.',
    headers={"WWW-Authenticate": "Bearer"},
)

authentication_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED, 
    detail='Incorrect username or password.',
    headers={"WWW-Authenticate": "Bearer"},
)

authorization_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN, 
    detail='User is not authorized to perform this action.',
    headers={"WWW-Authenticate": "Bearer"},
)