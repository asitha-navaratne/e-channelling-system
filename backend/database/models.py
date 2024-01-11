from sqlalchemy import Column, ForeignKey, Integer, String, DateTime

from database.config import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    title = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    phone_number = Column(String)
    address = Column(String)
    nic = Column(String)
    user_role = Column(String)
    hashed_password = Column(String)
    created_dttm = Column(DateTime)
    updated_dttm = Column(DateTime)

class Doctor(Base):
    __tablename__ = 'doctors'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    first_name = Column(String)
    last_name = Column(String)
    field = Column(String)
    phone_number = Column(String)
    address = Column(String)
    nic = Column(String)
    hashed_password = Column(String)
    created_dttm = Column(DateTime)
    updated_dttm = Column(DateTime)

class Availability(Base):
    __tablename__ = 'availability'

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey('doctors.id'), index=True)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    created_dttm = Column(DateTime)

class Appointment(Base):
    __tablename__ = 'appointments'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), index=True)
    doctor_id = Column(Integer, ForeignKey('doctors.id'), index=True)
    appointment_dttm = Column(DateTime)
    created_dttm = Column(DateTime)