import { AppBar, Toolbar, Typography } from "@mui/material";

import styles from "./Navbar.module.scss";
import logo from "../../assets/logo.png";

const Navbar = () => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <img
          src={logo}
          alt="E-Channelling Logo"
          className={styles["navbar__logo"]}
        />
        <Typography variant="h5" className={styles["navbar__header"]}>
          E-Channelling
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
