from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from starlette import status
from sqlalchemy.orm import Session

from .auth import get_current_user
from database.config import SessionLocal


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

router = APIRouter(
    prefix='/appointments',
    tags=['appointments']
)

@router.get('/')
async def get_all_appointments(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Authentication Failed')
    
    return {'appointments': []}