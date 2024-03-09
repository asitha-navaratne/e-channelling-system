enum ValidationErrorMessages {
  FieldEmptyMessage = "Field cannot be empty!",
  ValidEmailMessage = "Please enter a valid email address!",
  ValidPhoneNumberMessage = "Please enter a valid phone number!",
  PhoneNumberLeadingZeroMessage = "Please remove the leading zero!",
  PhoneNumberAreaCodeMessage = "Please remove the area code! (+94 etc.)",
  PhoneNumberDigitsMessage = "Phone number should be 9 digits!",
  EnterPasswordMessage = "Please enter your password!",
  IncorrectCredentialsMessage = "Incorrect username or password.",
  PasswordsNotMatchingMessage = "Passwords do not match!",
  EmailExistsMessage = "Email already exists!",
  ServerTimeoutMessage = "Server timed out. Please try again shortly!",
}

export default ValidationErrorMessages;
