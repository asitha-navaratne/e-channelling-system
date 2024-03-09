import { redirect } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";

import generatePhoneNumberErrorMessage from "../../helpers/generatePhoneNumberErrorMessage";
import handleCreateUserError from "../../helpers/handleCreateUserError";

import config from "../../configs/urls.config";
import { CreateNewUser } from "../../service/AuthServices";

import SignUpPayloadType from "../../types/SignUpPayloadType";
import ApiCallExceptionType from "../../types/ApiCallExceptionType";
import SignUpPayloadInitValues from "../../constants/SignUpPayloadInitValues";
import ValidationErrorMessages from "../../constants/ValidationErrorMessages";

async function action({ request }: { request: Request }) {
  const data = await request.formData();

  const errorResponse = { ...SignUpPayloadInitValues };

  const userData: SignUpPayloadType = {
    email: data.get("email") as string,
    title: data.get("title") as string,
    firstName: data.get("firstName") as string,
    lastName: data.get("lastName") as string,
    phoneNumber: data.get("phoneNumber") as string,
    nic: data.get("nic") as string,
    address: data.get("address") as string,
    password: data.get("password") as string,
    confirmPassword: data.get("confirmPassword") as string,
  };

  (Object.keys(userData) as Array<keyof typeof userData>).forEach((field) => {
    if (userData[field] === "") {
      errorResponse[field] = ValidationErrorMessages.FieldEmptyMessage;
    } else if (field === "email" && !userData[field].includes("@")) {
      errorResponse["email"] = ValidationErrorMessages.ValidEmailMessage;
    } else if (field === "phoneNumber") {
      errorResponse["phoneNumber"] = generatePhoneNumberErrorMessage(
        userData["phoneNumber"]
      );
    } else if (
      field === "password" &&
      userData["password"] !== userData["confirmPassword"]
    ) {
      errorResponse["password"] =
        ValidationErrorMessages.PasswordsNotMatchingMessage;
      errorResponse["confirmPassword"] =
        ValidationErrorMessages.PasswordsNotMatchingMessage;
    }
  });

  if (!Object.values(errorResponse).every((value) => value === "")) {
    return errorResponse;
  }

  const res: AxiosResponse<null> & AxiosError<ApiCallExceptionType> =
    await CreateNewUser(userData).catch((err) => {
      return err;
    });

  if (res.name === "AxiosError") {
    return handleCreateUserError(res);
  }

  return redirect(config.routes.login);
}

export default action;
