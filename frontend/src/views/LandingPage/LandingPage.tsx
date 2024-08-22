import { Box, Button, Stack } from "@mui/material";

import Navbar from "../../components/Navbar/Navbar";

import styles from "./LandingPage.module.scss";

const LandingPage = () => {
  return (
    <Box className={styles["landing-page"]}>
      <Navbar />
      <Box className={styles["landing-page__body-section"]}>
        <Stack
          className={styles["landing-page__description-section"]}
          justifyContent="center"
          alignItems="flex-start"
        >
          <h1 className={styles["landing-page__title"]}>
            Book your next <span>appointment</span> with ease!
          </h1>
          <p className={styles["landing-page__description-text"]}>
            Whether you're seeking medical advice, therapy sessions, or wellness
            consultations, our user-friendly portal connects you with a diverse
            range of practitioners in just a few clicks. Say goodbye to long
            waiting times and endless phone calls - streamline your healthcare
            journey with our convenient online booking system.
          </p>
          <Button
            variant="contained"
            sx={{
              mt: 8,
              fontSize: {
                xs: "2.2vw",
                md: "2vw",
                lg: "0.8vw",
              },
            }}
          >
            Get Started
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default LandingPage;
