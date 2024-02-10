import { AxiosResponse } from "axios";

import config from "../configs/urls.config";
import AxiosInstance from "../utils/axios";

import GetAuthTokenResponseType from "../types/GetAuthTokenResponseType";

const GetAuthToken = function (
  email: string = "",
  password: string = ""
): Promise<AxiosResponse<GetAuthTokenResponseType>> {
  const formData = new FormData();

  formData.append("username", email);
  formData.append("password", password);

  return AxiosInstance.post(config.api.endpoints.auth, formData);
};

export { GetAuthToken };
