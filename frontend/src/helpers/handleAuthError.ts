import { AxiosError } from "axios";

import ApiCallExceptionType from "../types/ApiCallExceptionType";

const handleAuthError = function (
  err: AxiosError<ApiCallExceptionType>
): [string, string, string] {
  if (err.response?.data?.detail === "Incorrect username or password.") {
    return [err.response.data.detail, err.response.data.detail, ""];
  } else if (err.response?.data?.detail) {
    return ["", "", err.response?.data?.detail];
  }

  return ["", "", err.message];
};

export default handleAuthError;
