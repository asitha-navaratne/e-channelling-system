import { FC, useMemo, useState } from "react";
import { Box, IconButton, useMediaQuery } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import styles from "./Calendar.module.scss";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Calendar: FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const matches = useMediaQuery(
    "((max-width: 1000px) and (orientation: landscape)) or (max-width: 300px)"
  );

  const month = months[selectedDate.getMonth()];
  const year = selectedDate.getFullYear();
  const currentDateString = useMemo(() => new Date().toDateString(), []);

  const date = new Date(selectedDate);
  date.setDate(1);

  const lastDayOfMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  const lastDayOfPreviousMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  const firstDayIndex = date.getDay();
  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();
  const remainingDays = 7 - lastDayIndex - 1;

  const handlePreviousButtonClick = function (): void {
    const date = new Date(selectedDate);
    date.setMonth(date.getMonth() - 1);
    setSelectedDate(date);
  };

  const handleNextButtonClick = function (): void {
    const date = new Date(selectedDate);
    date.setMonth(date.getMonth() + 1);
    setSelectedDate(date);
  };

  return (
    <Box className={styles["calendar"]}>
      <Box className={styles["calendar__header"]}>
        <IconButton
          size={matches ? "small" : "medium"}
          onClick={handlePreviousButtonClick}
        >
          <KeyboardArrowLeftIcon fontSize="inherit" />
        </IconButton>
        <Box className={styles["calendar__header-details"]}>
          <h3 className={styles["calendar__current-month"]}>{month}</h3>
          <p>{year}</p>
          <p className={styles["calendar__current-date"]}>
            {currentDateString}
          </p>
        </Box>
        <IconButton
          size={matches ? "small" : "medium"}
          onClick={handleNextButtonClick}
        >
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
        {[...Array(firstDayIndex).keys()].map((day: number) => (
          <Box
            key={day}
            className={`${styles["calendar__day-container"]} ${styles["calendar__day-container--greyed-out"]}`}
          >
            {lastDayOfPreviousMonth - (firstDayIndex - day - 1)}
          </Box>
        ))}
        {[...Array(lastDayOfMonth).keys()].map((day: number) => (
          <Box
            key={day}
            className={`${styles["calendar__day-container"]} ${styles["calendar__current-month-days"]}`}
          >
            {day + 1}
          </Box>
        ))}
        {[...Array(remainingDays).keys()].map((day: number) => (
          <Box
            key={day}
            className={`${styles["calendar__day-container"]} ${styles["calendar__day-container--greyed-out"]}`}
          >
            {day + 1}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Calendar;
