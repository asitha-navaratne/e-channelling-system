import { FC } from "react";
import { Box, IconButton, useMediaQuery } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import styles from "./Calendar.module.scss";

const Calendar: FC = () => {
  const matches = useMediaQuery(
    "(max-width: 1000px) and (orientation: landscape)"
  );

  return (
    <Box className={styles["calendar"]}>
      <Box className={styles["calendar__header"]}>
        <IconButton size={matches ? "small" : "medium"}>
          <KeyboardArrowLeftIcon fontSize="inherit" />
        </IconButton>
        <Box className={styles["calendar__header-details"]}>
          <h3 className={styles["calendar__current-month"]}>March</h3>
          <p>2024</p>
          <p className={styles["calendar__current-date"]}>Thu Mar 14, 2024</p>
        </Box>
        <IconButton size={matches ? "small" : "medium"}>
          <KeyboardArrowRightIcon fontSize="inherit" />
        </IconButton>
      </Box>
      <Box className={styles["calendar__week-section"]}>
        <p>Sun</p>
        <p>Mon</p>
        <p>Tue</p>
        <p>Wed</p>
        <p>Thur</p>
        <p>Fri</p>
        <p>Sat</p>
      </Box>
      <Box className={styles["calendar__days-section"]}>
        {[...Array(42).keys()].map((day: number) => (
          <Box key={day} className={styles["calendar__day-container"]}>
            {day + 1}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Calendar;
