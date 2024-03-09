import { AxiosResponse } from "axios";

import config from "../configs/urls.config";
import AxiosInstance from "../utils/axios";

import GetAuthTokenResponseType from "../types/GetAuthTokenResponseType";
import SignUpPayloadType from "../types/SignUpPayloadType";

const GetAuthToken = function (
  email: string = "",
  password: string = ""
): Promise<AxiosResponse<GetAuthTokenResponseType>> {
  const formData = new FormData();

  formData.append("username", email);
  formData.append("password", password);

  return AxiosInstance.post(config.api.endpoints.auth, formData);
};

const CreateNewUser = function (
  payload: SignUpPayloadType
): Promise<AxiosResponse<null>> {
  return AxiosInstance.post(config.api.endpoints.user.createUser, {
    email: payload.email,
    title: payload.title,
    first_name: payload.firstName,
    last_name: payload.lastName,
    phone_number: payload.phoneNumber,
    nic: payload.nic,
    address: payload.address,
    password: payload.password,
  });
};

export { GetAuthToken, CreateNewUser };
