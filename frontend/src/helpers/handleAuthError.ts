import { AxiosError } from "axios";

import ApiCallExceptionType from "../types/ApiCallExceptionType";
import LoginErrorMessageType from "../types/LoginErrorMessageType";
import ValidationErrorMessages from "../constants/ValidationErrorMessages";

const handleAuthError = function (
  err: AxiosError<ApiCallExceptionType>
): LoginErrorMessageType {
  if (err.response?.data?.detail === "Incorrect username or password.") {
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
  }

  return {
    emailHelperText: "",
    passwordHelperText: "",
    errorMessage: err.message,
  };
};

export default handleAuthError;
