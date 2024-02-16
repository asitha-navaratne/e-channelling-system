import { redirect } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";

import handleAuthError from "../../helpers/handleAuthError";

import config from "../../configs/urls.config";
import { GetAuthToken } from "../../service/AuthServices";

import ApiCallExceptionType from "../../types/ApiCallExceptionType";
import GetAuthTokenResponseType from "../../types/GetAuthTokenResponseType";

async function action({ request }: { request: Request }) {
  const data = await request.formData();

  const errorResponse = {
    emailHelperText: "",
    passwordHelperText: "",
    errorMessage: "",
  };

  const email = data.get("email") as string;
  const password = data.get("password") as string;

  if (email === "" || !email.includes("@")) {
    errorResponse.emailHelperText = "Please enter a valid email address!";
    return errorResponse;
  }

  if (password === "") {
    errorResponse.passwordHelperText = "Please enter your password!";
    return errorResponse;
  }

  const res: AxiosResponse<GetAuthTokenResponseType> &
    AxiosError<ApiCallExceptionType> = await GetAuthToken(
    email,
    password
  ).catch((err) => {
    return err;
  });

  if (res.name === "AxiosError") {
    return handleAuthError(res);
  }

  const token = res.data.access_token;
  localStorage.setItem("token", token);

  return redirect(config.routes.root);
}

export default action;
