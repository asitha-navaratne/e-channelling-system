import { AxiosError } from "axios";

import ApiCallExceptionType from "../types/ApiCallExceptionType";
import LoginErrorMessageType from "../types/LoginErrorMessageType";

const handleAuthError = function (
  err: AxiosError<ApiCallExceptionType>
): LoginErrorMessageType {
  if (err.response?.data?.detail === "Incorrect username or password.") {
    return {
      emailHelperText: "Incorrect username or password.",
      passwordHelperText: "Incorrect username or password.",
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
