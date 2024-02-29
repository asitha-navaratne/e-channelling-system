import { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { Button, IconButton, Stack, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import styles from "./SignUpForm.module.scss";
import logo from "../../assets/logo.png";

import config from "../../configs/urls.config";

import SignUpPayloadType from "../../types/SignUpPayloadType";

const SignUpForm = () => {
  const [userDetails, setUserDetails] = useState<SignUpPayloadType>({
    email: "",
    title: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    nic: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
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
        <TextField label="Email" type="text" name="email" sx={{ mt: 5 }} />
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
            className={styles["sign-up-form__textfield"]}
          />
          <TextField
            label="Last Name"
            type="text"
            name="lastName"
            className={styles["sign-up-form__textfield"]}
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
            className={styles["sign-up-form__textfield"]}
          />
          <TextField
            label="NIC"
            type="text"
            name="nic"
            className={styles["sign-up-form__textfield"]}
          />
        </Stack>
        <TextField label="Address" type="text" name="address" />
        <TextField
          label="Password"
          type={isPasswordShown ? "text" : "password"}
          name="password"
          InputProps={{
            endAdornment: (
              <IconButton edge="end" onClick={toggleShowPassword}>
                {isPasswordShown ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            ),
          }}
          sx={{ mt: 3 }}
        />
        <TextField
          label="Confirm Password"
          type={isConfirmPasswordShown ? "text" : "password"}
          name="confirmPassword"
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
