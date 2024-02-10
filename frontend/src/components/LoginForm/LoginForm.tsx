import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Button, IconButton, Stack, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import styles from "./LoginForm.module.scss";
import logo from "../../assets/logo.png";

import handleAuthError from "../../helpers/handleAuthError";

import { GetAuthToken } from "../../service/AuthServices";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);
  const [isLoginButtonDisabled, setIsLoginButtonDisabled] =
    useState<boolean>(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const toggleShowPassword = function (): void {
    setIsPasswordShown((prev) => !prev);
  };

  const handleEmailChange = function (e: ChangeEvent<HTMLInputElement>): void {
    setEmailErrorMessage("");
    setEmail(e.target.value);
  };

  const validateEmail = function (): void {
    if (email !== "" && !email.includes("@")) {
      setEmailErrorMessage("Please enter a valid email address!");
    }
  };

  const handlePasswordChange = function (
    e: ChangeEvent<HTMLInputElement>
  ): void {
    setPasswordErrorMessage("");
    setPassword(e.target.value);
  };

  const handleSubmit = function (e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    setErrorMessage("");

    if (email === "" || !email.includes("@")) {
      setEmailErrorMessage("Please enter a valid email address!");
      emailInputRef.current?.focus();

      return;
    }

    if (password === "") {
      setPasswordErrorMessage("Please enter your password!");
      passwordInputRef.current?.focus();

      return;
    }

    setIsLoginButtonDisabled(true);
    GetAuthToken(email, password)
      .then((res) => console.log(res.data))
      .catch((err) => {
        const [emailError, passwordError, genericError] = handleAuthError(err);

        setEmailErrorMessage(emailError);
        setPasswordErrorMessage(passwordError);
        setErrorMessage(genericError);
      })
      .finally(() => {
        setIsLoginButtonDisabled(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} className={styles["login-form"]}>
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
          sx={{ mt: 2 }}
          value={email}
          ref={emailInputRef}
          onChange={handleEmailChange}
          onBlur={validateEmail}
          error={emailErrorMessage !== ""}
          helperText={emailErrorMessage}
        />
        <TextField
          label="Password"
          type={isPasswordShown ? "text" : "password"}
          value={password}
          ref={passwordInputRef}
          onChange={handlePasswordChange}
          InputProps={{
            endAdornment: (
              <IconButton edge="end" onClick={toggleShowPassword}>
                {isPasswordShown ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            ),
          }}
          error={passwordErrorMessage !== ""}
          helperText={passwordErrorMessage}
        />
        <p className={styles["login-form__error-message"]}>
          &#8203;{errorMessage}
        </p>
        <Button
          variant="contained"
          type="submit"
          sx={{ mt: 1 }}
          disabled={isLoginButtonDisabled}
        >
          Log in
        </Button>
        <p className={styles["login-form__help-text"]}>
          Don't have an account?
        </p>
        <Button variant="outlined">Sign Up</Button>
        <Button variant="text" sx={{ mt: 4, mb: 4 }}>
          Forgot Password?
        </Button>
      </Stack>
    </form>
  );
};

export default LoginForm;
