import { ChangeEvent, FC, useEffect, useState } from "react";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { Button, IconButton, Stack, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import styles from "./LoginForm.module.scss";
import logo from "../../assets/logo.png";

import config from "../../configs/urls.config";

import LoginErrorMessageType from "../../types/LoginErrorMessageType";
import ValidationErrorMessages from "../../constants/ValidationErrorMessages";

const LoginForm: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailHelperText, setEmailHelperText] = useState<string>();
  const [passwordHelperText, setPasswordHelperText] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);

  const data = useActionData() as LoginErrorMessageType;
  const navigate = useNavigate();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    setEmailHelperText(data?.emailHelperText ?? "");
    setPasswordHelperText(data?.passwordHelperText ?? "");
    setErrorMessage(data?.errorMessage ?? "");
  }, [data]);

  const toggleShowPassword = function (): void {
    setIsPasswordShown((prev) => !prev);
  };

  const handleEmailChange = function (e: ChangeEvent<HTMLInputElement>): void {
    setEmailHelperText("");
    setEmail(e.target.value);
  };

  const validateEmail = function (): void {
    if (email !== "" && !email.includes("@")) {
      setEmailHelperText(ValidationErrorMessages.ValidEmailMessage);
    }
  };

  const handlePasswordChange = function (
    e: ChangeEvent<HTMLInputElement>
  ): void {
    setPasswordHelperText("");
    setPassword(e.target.value);
  };

  const handleSignUpButtonClick = function (): void {
    navigate(config.routes.signup);
  };

  return (
    <Form method="POST" className={styles["login-form"]}>
      <Stack paddingX={4}>
        <img src={logo} className={styles["login-form__logo"]} />
        <h2 className={styles["login-form__header"]}>Sign In</h2>
        <p className={styles["login-form__intro-text"]}>
          Unlock top-tier healthcare! Sign in for instant appointments with
          expert physicians and doctors.
        </p>
        <p className={styles["login-form__intro-text"]}>
          Your health, simplified.
        </p>
        <TextField
          label="Email"
          type="text"
          name="email"
          sx={{ mt: 2 }}
          value={email}
          onChange={handleEmailChange}
          onBlur={validateEmail}
          error={emailHelperText !== ""}
          helperText={emailHelperText}
        />
        <TextField
          label="Password"
          type={isPasswordShown ? "text" : "password"}
          name="password"
          value={password}
          onChange={handlePasswordChange}
          InputProps={{
            endAdornment: (
              <IconButton edge="end" onClick={toggleShowPassword}>
                {isPasswordShown ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            ),
          }}
          error={passwordHelperText !== ""}
          helperText={passwordHelperText}
        />
        <p className={styles["login-form__error-message"]}>
          &#8203;{errorMessage}
        </p>
        <Button
          variant="contained"
          type="submit"
          sx={{ mt: 1 }}
          disabled={isSubmitting}
        >
          Log in
        </Button>
        <p className={styles["login-form__help-text"]}>
          Don't have an account?
        </p>
        <Button variant="outlined" onClick={handleSignUpButtonClick}>
          Sign Up
        </Button>
        <Button variant="text" sx={{ mt: 4, mb: 4 }}>
          Forgot Password?
        </Button>
      </Stack>
    </Form>
  );
};

export default LoginForm;
