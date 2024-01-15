from fastapi import FastAPI

import database.models as models
from database.config import engine

from routers import auth, appointments, availability


app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(appointments.router)
app.include_router(availability.router)

@app.get('/')
def root():
    return {'status': 'OK'}