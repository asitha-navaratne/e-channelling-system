import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#176B87",
    },
    secondary: {
      main: "#F1962E",
      contrastText: "#fff",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "0px",
          transition: "1s",
        },
      },
    },
  },
});

export default theme;
