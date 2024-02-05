import { useState } from "react";
import { Button, IconButton, Stack, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import styles from "./LoginForm.module.scss";
import logo from "../../assets/logo.png";

const LoginForm = () => {
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);

  const toggleShowPassword = function (): void {
    setIsPasswordShown((prev) => !prev);
  };

  return (
    <form className={styles["login-form"]}>
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
        <TextField label="Email" type="text" sx={{ mt: 2 }} />
        <TextField
          label="Password"
          type={isPasswordShown ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <IconButton edge="end" onClick={toggleShowPassword}>
                {isPasswordShown ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            ),
          }}
        />
        <Button variant="contained" sx={{ mt: 1 }}>
          Log in
        </Button>
        <p className={styles["login-form__help-text"]}>
          Don't have an account?
        </p>
        <Button variant="outlined">Sign Up</Button>
        <Button variant="text" sx={{ mt: 4 }}>
          Forgot Password?
        </Button>
      </Stack>
    </form>
  );
};

export default LoginForm;
