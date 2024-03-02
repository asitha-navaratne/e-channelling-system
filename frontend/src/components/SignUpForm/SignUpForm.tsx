import { ChangeEvent, FC, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import styles from "./SignUpForm.module.scss";
import logo from "../../assets/logo.png";

import config from "../../configs/urls.config";

import SignUpPayloadType from "../../types/SignUpPayloadType";
import SignUpPayloadInitValues from "../../constants/SignUpPayloadInitValues";
import ValidationErrorMessages from "../../constants/ValidationErrorMessages";

const SignUpForm: FC = () => {
  const [userDetails, setUserDetails] = useState<SignUpPayloadType>(
    SignUpPayloadInitValues
  );
  const [inputHelperText, setInputHelperText] = useState<SignUpPayloadType>(
    SignUpPayloadInitValues
  );
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] =
    useState<boolean>(false);

  const navigate = useNavigate();

  const toggleShowPassword = function (): void {
    setIsPasswordShown((prev) => !prev);
  };

  const toggleShowConfirmPassword = function (): void {
    setIsConfirmPasswordShown((prev) => !prev);
  };

  const handleFieldBlur = function (): void {
    if (userDetails["email"] !== "" && !userDetails["email"].includes("@")) {
      setInputHelperText((prev) => ({
        ...prev,
        email: ValidationErrorMessages.ValidEmailMessage,
      }));
    }
    if (userDetails["phoneNumber"] !== "") {
      setInputHelperText((prev) => ({
        ...prev,
        phoneNumber: generatePhoneNumberErrorMessage(),
      }));
    }
  };

  const handleFieldChange = function (e: ChangeEvent<HTMLInputElement>): void {
    setInputHelperText((prev) => ({ ...prev, [e.target.name]: "" }));
    setUserDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generatePhoneNumberErrorMessage = function (): string {
    if (userDetails["phoneNumber"][0] === "0") {
      return ValidationErrorMessages.PhoneNumberLeadingZeroMessage;
    }
    if (userDetails["phoneNumber"][0] === "+") {
      return ValidationErrorMessages.PhoneNumberAreaCodeMessage;
    }
    if (userDetails["phoneNumber"].match(/[^0-9]/g)) {
      return ValidationErrorMessages.ValidPhoneNumberMessage;
    }
    if (userDetails["phoneNumber"].length !== 9) {
      return ValidationErrorMessages.PhoneNumberDigitsMessage;
    }

    return "";
  };

  const handleLogInButtonClick = function (): void {
    navigate(config.routes.login);
  };

  return (
    <Form className={styles["sign-up-form"]}>
      <Stack paddingX={4}>
        <img src={logo} className={styles["sign-up-form__logo"]} />
        <p className={styles["sign-up-form__intro-text"]}>
          Sign up to book instant appointments with expert physicians and
          doctors at your convenience.
        </p>
        <TextField
          label="Email"
          type="text"
          name="email"
          value={userDetails["email"]}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          sx={{ mt: 5 }}
          error={inputHelperText["email"].length > 0}
          helperText={inputHelperText["email"]}
        />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: "2vh" }}
        >
          <TextField
            label="First Name"
            type="text"
            name="firstName"
            value={userDetails["firstName"]}
            onChange={handleFieldChange}
            className={styles["sign-up-form__textfield"]}
            error={inputHelperText["firstName"].length > 0}
            helperText={inputHelperText["firstName"]}
          />
          <TextField
            label="Last Name"
            type="text"
            name="lastName"
            value={userDetails["lastName"]}
            onChange={handleFieldChange}
            className={styles["sign-up-form__textfield"]}
            error={inputHelperText["lastName"].length > 0}
            helperText={inputHelperText["lastName"]}
          />
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: "2vh" }}
        >
          <TextField
            label="Phone Number"
            type="text"
            name="phoneNumber"
            value={userDetails["phoneNumber"]}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            className={styles["sign-up-form__textfield"]}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">(+94)</InputAdornment>
              ),
            }}
            error={inputHelperText["phoneNumber"].length > 0}
            helperText={inputHelperText["phoneNumber"]}
          />
          <TextField
            label="NIC"
            type="text"
            name="nic"
            value={userDetails["nic"]}
            onChange={handleFieldChange}
            className={styles["sign-up-form__textfield"]}
            error={inputHelperText["nic"].length > 0}
            helperText={inputHelperText["nic"]}
          />
        </Stack>
        <TextField
          label="Address"
          type="text"
          name="address"
          value={userDetails["address"]}
          onChange={handleFieldChange}
          error={inputHelperText["address"].length > 0}
          helperText={inputHelperText["address"]}
        />
        <TextField
          label="Password"
          type={isPasswordShown ? "text" : "password"}
          name="password"
          value={userDetails["password"]}
          onChange={handleFieldChange}
          InputProps={{
            endAdornment: (
              <IconButton edge="end" onClick={toggleShowPassword}>
                {isPasswordShown ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            ),
          }}
          sx={{ mt: 3 }}
          error={inputHelperText["password"].length > 0}
          helperText={inputHelperText["password"]}
        />
        <TextField
          label="Confirm Password"
          type={isConfirmPasswordShown ? "text" : "password"}
          name="confirmPassword"
          value={userDetails["confirmPassword"]}
          onChange={handleFieldChange}
          InputProps={{
            endAdornment: (
              <IconButton edge="end" onClick={toggleShowConfirmPassword}>
                {isConfirmPasswordShown ? (
                  <VisibilityIcon />
                ) : (
                  <VisibilityOffIcon />
                )}
              </IconButton>
            ),
          }}
          error={inputHelperText["confirmPassword"].length > 0}
          helperText={inputHelperText["confirmPassword"]}
        />
        <Button variant="contained" type="submit" sx={{ mt: 5 }}>
          Sign Up
        </Button>
        <p className={styles["sign-up-form__help-text"]}>
          Already have an account?
        </p>
        <Button
          variant="outlined"
          sx={{ mb: 5 }}
          onClick={handleLogInButtonClick}
        >
          Log In
        </Button>
      </Stack>
    </Form>
  );
};

export default SignUpForm;
