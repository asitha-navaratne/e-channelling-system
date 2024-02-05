import { FC } from "react";
import { Box, Card } from "@mui/material";

import styles from "./LoginPage.module.scss";

import LoginForm from "../../components/LoginForm/LoginForm";

const LoginPage: FC = () => {
  return (
    <Box className={styles["login-page"]}>
      <Card className={styles["login-page__form-container"]}>
        <Box
          className={styles["login-page__backdrop"]}
          about="Photo by Jeremy Alford on Unsplash"
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
          }}
        ></Box>
        <LoginForm />
      </Card>
    </Box>
  );
};

export default LoginPage;
