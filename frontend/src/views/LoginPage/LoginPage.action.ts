import { redirect } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";

import handleLoginError from "../../helpers/handleLoginError";

import config from "../../configs/urls.config";
import { GetAuthToken } from "../../service/AuthServices";

import ApiCallExceptionType from "../../types/ApiCallExceptionType";
import GetAuthTokenResponseType from "../../types/GetAuthTokenResponseType";
import ValidationErrorMessages from "../../constants/ValidationErrorMessages";

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
    errorResponse.emailHelperText = ValidationErrorMessages.ValidEmailMessage;
    return errorResponse;
  }

  if (password === "") {
    errorResponse.passwordHelperText =
      ValidationErrorMessages.EnterPasswordMessage;
    return errorResponse;
  }

  const res: AxiosResponse<GetAuthTokenResponseType> &
    AxiosError<ApiCallExceptionType<{ email: string; password: string }>> =
    await GetAuthToken(email, password).catch((err) => {
      return err;
    });

  if (res.name === "AxiosError") {
    return handleLoginError(res);
  }

  const token = res.data.access_token;
  localStorage.setItem("token", token);

  return redirect(config.routes.root);
}

export default action;
