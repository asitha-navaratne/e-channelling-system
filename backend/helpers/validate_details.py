from classes.CreateUserRequest import CreateUserRequest
from classes.CreateDoctorRequest import CreateDoctorRequest

from errors.auth_exceptions import empty_fields_exception, phone_number_exception

def validate_details(create_user_request: CreateUserRequest | CreateDoctorRequest):
    create_user_request_dict = create_user_request.__dict__

    for value in create_user_request_dict.values():
        if value == "":
            raise empty_fields_exception
        
    if len(create_user_request.phone_number) != 9:
        raise phone_number_exception