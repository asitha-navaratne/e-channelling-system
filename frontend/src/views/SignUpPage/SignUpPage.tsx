import { FC } from "react";
import { Box, Card } from "@mui/material";

import styles from "./SignUpPage.module.scss";

import SignUpForm from "../../components/SignUpForm/SignUpForm";

const SignUpPage: FC = () => {
  return (
    <Box className={styles["sign-up-page"]}>
      <Card className={styles["sign-up-page__form-container"]}>
        <SignUpForm />
      </Card>
    </Box>
  );
};

export default SignUpPage;
