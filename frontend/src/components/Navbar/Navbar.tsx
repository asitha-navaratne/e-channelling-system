import { AppBar, Toolbar, Typography } from "@mui/material";

import styles from "./Navbar.module.scss";
import logo from "../../assets/logo.png";

const Navbar = () => {
  return (
    <AppBar position="sticky" className={styles["navbar"]}>
      <Toolbar>
        <img
          src={logo}
          alt="E-Channelling Logo"
          className={styles["navbar__logo"]}
        />
        <Typography
          variant="h5"
          className={styles["navbar__header"]}
          sx={{ fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" } }}
        >
          E-Channelling
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
