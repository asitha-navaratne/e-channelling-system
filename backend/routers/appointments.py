from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from starlette import status
from sqlalchemy.orm import Session

from .auth import get_current_user
from database.config import SessionLocal
from errors.auth_exceptions import credential_exception


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
token_dependency = Annotated[dict, Depends(get_current_user)]

router = APIRouter(
    prefix='/appointments',
    tags=['appointments']
)

@router.get('/')
async def get_all_appointments(token: token_dependency, db: db_dependency):
    if token is None:
        raise credential_exception
    
    return {'appointments': []}