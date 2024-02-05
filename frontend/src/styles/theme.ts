import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#176b87",
    },
    secondary: {
      main: "#f1962e",
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
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "0px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: "2vh",
        },
      },
    },
  },
});

export default theme;
