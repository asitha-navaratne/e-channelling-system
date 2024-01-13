from fastapi import FastAPI

import database.models as models
from database.config import engine

from routers import auth, appointments


app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(appointments.router)

@app.get('/')
def root():
    return {'status': 'OK'}