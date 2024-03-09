import os
from datetime import datetime, timedelta, timezone
from jose import jwt


def create_access_token(email: str, user_id: int, user_role: str, expires_delta: timedelta):
    encode = {'sub': email, 'id': user_id, 'role': user_role}
    expires = datetime.now(tz=timezone.utc) + expires_delta
    encode.update({'exp': expires})

    return jwt.encode(encode, os.getenv("SECRET_KEY"), algorithm = os.getenv('ALGORITHM'))