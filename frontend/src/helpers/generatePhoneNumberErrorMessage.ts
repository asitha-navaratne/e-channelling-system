import ValidationErrorMessages from "../constants/ValidationErrorMessages";

const generatePhoneNumberErrorMessage = function (value: string): string {
  if (value[0] === "0") {
    return ValidationErrorMessages.PhoneNumberLeadingZeroMessage;
  }
  if (value[0] === "+") {
    return ValidationErrorMessages.PhoneNumberAreaCodeMessage;
  }
  if (value.match(/[^0-9]/g)) {
    return ValidationErrorMessages.ValidPhoneNumberMessage;
  }
  if (value.length !== 9) {
    return ValidationErrorMessages.PhoneNumberDigitsMessage;
  }

  return "";
};

export default generatePhoneNumberErrorMessage;
