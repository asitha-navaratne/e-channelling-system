import { AxiosError } from "axios";

import ApiCallExceptionType from "../types/ApiCallExceptionType";
import SignUpErrorMessageType from "../types/SignUpErrorMessageType";
import AuthErrorMessageType from "../types/AuthErrorMessageType";
import ValidationErrorMessages from "../constants/ValidationErrorMessages";

const handleCreateUserError = function (
  err: AxiosError<ApiCallExceptionType<SignUpErrorMessageType>>
): AuthErrorMessageType {
  if (err.response?.data.detail?.[0].msg) {
    return {
      emailHelperText: "",
      passwordHelperText: "",
      errorMessage: err.response?.data.detail?.[0].msg,
    };
  } else if (err.response?.data?.detail === "Email already exists.") {
    return {
      emailHelperText: ValidationErrorMessages.EmailExistsMessage,
      passwordHelperText: "",
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

export default handleCreateUserError;
