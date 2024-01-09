from fastapi import FastAPI, Depends
from typing import Annotated
from sqlalchemy.orm import Session

import database.models as models
from database.config import engine, SessionLocal

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@app.get('/')
def root():
    return {'status': 'OK'}

@app.get('/appointments')
async def get_all_appointments(db: db_dependency):
    return db.query(models.Appointments).all()