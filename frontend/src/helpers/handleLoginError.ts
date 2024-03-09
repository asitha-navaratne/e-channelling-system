import { AxiosError } from "axios";

import ApiCallExceptionType from "../types/ApiCallExceptionType";
import LoginErrorMessageType from "../types/AuthErrorMessageType";
import ValidationErrorMessages from "../constants/ValidationErrorMessages";

const handleLoginError = function (
  err: AxiosError<ApiCallExceptionType<{ email: string; password: string }>>
): LoginErrorMessageType {
  if (err.response?.data.detail?.[0].msg) {
    return {
      emailHelperText: "",
      passwordHelperText: "",
      errorMessage: err.response?.data.detail?.[0].msg,
    };
  } else if (err.response?.data?.detail === "Incorrect username or password.") {
    return {
      emailHelperText: ValidationErrorMessages.IncorrectCredentialsMessage,
      passwordHelperText: ValidationErrorMessages.IncorrectCredentialsMessage,
      errorMessage: "",
    };
  } else if (err.response?.data?.detail) {
    return {
      emailHelperText: "",
      passwordHelperText: "",
      errorMessage: err.response?.data?.detail,
    };
  } else if (err.message === "timeout of 5000ms exceeded") {
    return {
      emailHelperText: "",
      passwordHelperText: "",
      errorMessage: ValidationErrorMessages.ServerTimeoutMessage,
    };
  }

  return {
    emailHelperText: "",
    passwordHelperText: "",
    errorMessage: err.message,
  };
};

export default handleLoginError;
