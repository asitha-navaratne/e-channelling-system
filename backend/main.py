from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import database.models as models
from database.config import engine

from routers import auth, appointments, availability, user, doctor


app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

models.Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(doctor.router)
app.include_router(appointments.router)
app.include_router(availability.router)