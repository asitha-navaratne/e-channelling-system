import { FC } from "react";
import { Box } from "@mui/material";

import styles from "./HomePage.module.scss";

import Calendar from "../../components/Calendar/Calendar";

const HomePage: FC = () => {
  return (
    <Box className={styles["home-page"]}>
      <Box className={styles["home-page__calendar-section"]}>
        <Calendar />
      </Box>
    </Box>
  );
};

export default HomePage;
