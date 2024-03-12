import { ChangeEvent, FC, useEffect, useState } from "react";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import styles from "./SignUpForm.module.scss";
import logo from "../../assets/logo.png";

import generatePhoneNumberErrorMessage from "../../helpers/generatePhoneNumberErrorMessage";

import config from "../../configs/urls.config";

import SignUpPayloadType from "../../types/SignUpPayloadType";
import AuthErrorMessageType from "../../types/AuthErrorMessageType";
import SignUpPayloadInitValues from "../../constants/SignUpPayloadInitValues";
import ValidationErrorMessages from "../../constants/ValidationErrorMessages";

const SignUpForm: FC = () => {
  const [userDetails, setUserDetails] = useState<SignUpPayloadType>(
    SignUpPayloadInitValues
  );
  const [inputHelperText, setInputHelperText] = useState<SignUpPayloadType>(
    SignUpPayloadInitValues
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] =
    useState<boolean>(false);

  const data = useActionData() as AuthErrorMessageType;
  const navigate = useNavigate();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (data) {
      setInputHelperText((prev) => ({
        ...prev,
        email: data.emailHelperText,
        password: data.passwordHelperText,
      }));
      setErrorMessage(data.errorMessage);
    }
  }, [data]);

  const toggleShowPassword = function (): void {
    setIsPasswordShown((prev) => !prev);
  };

  const toggleShowConfirmPassword = function (): void {
    setIsConfirmPasswordShown((prev) => !prev);
  };

  const handleFieldBlur = function (): void {
    if (userDetails["email"] !== "" && !userDetails["email"].includes("@")) {
      setInputHelperText((prev) => ({
        ...prev,
        email: ValidationErrorMessages.ValidEmailMessage,
      }));
    }
    if (userDetails["phoneNumber"] !== "") {
      setInputHelperText((prev) => ({
        ...prev,
        phoneNumber: generatePhoneNumberErrorMessage(
          userDetails["phoneNumber"]
        ),
      }));
    }
  };

  const handleFieldChange = function (e: ChangeEvent<HTMLInputElement>): void {
    setInputHelperText((prev) => ({ ...prev, [e.target.name]: "" }));
    setUserDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTitleFieldChange = function (e: SelectChangeEvent): void {
    setInputHelperText((prev) => ({ ...prev, title: "" }));
    setUserDetails((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleLogInButtonClick = function (): void {
    navigate(config.routes.login);
  };

  return (
    <Form method="POST" className={styles["sign-up-form"]}>
      <Stack paddingX={4}>
        <img
          src={logo}
          alt="E-Channelling Logo"
          className={styles["sign-up-form__logo"]}
        />
        <p className={styles["sign-up-form__intro-text"]}>
          Sign up to book instant appointments with expert physicians and
          doctors at your convenience.
        </p>
        <TextField
          label="Email"
          type="text"
          name="email"
          value={userDetails["email"]}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          sx={{ mt: 4 }}
          error={inputHelperText["email"].length > 0}
          helperText={inputHelperText["email"]}
        />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: "2vh" }}
        >
          <FormControl
            sx={{ minWidth: 150 }}
            error={inputHelperText["title"].length > 0}
          >
            <InputLabel id="title-select-label">Title</InputLabel>
            <Select
              label="Title"
              labelId="title-select-label"
              name="title"
              value={userDetails["title"]}
              onChange={handleTitleFieldChange}
              onBlur={handleFieldBlur}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Mr.">Mr.</MenuItem>
              <MenuItem value="Mrs.">Mrs.</MenuItem>
              <MenuItem value="Ms.">Ms.</MenuItem>
              <MenuItem value="Master">Master</MenuItem>
              <MenuItem value="Miss">Miss</MenuItem>
              <MenuItem value="Dr.">Dr.</MenuItem>
              <MenuItem value="Rev.">Rev.</MenuItem>
            </Select>
            <FormHelperText>{inputHelperText["title"]}</FormHelperText>
          </FormControl>
          <TextField
            label="First Name"
            type="text"
            name="firstName"
            value={userDetails["firstName"]}
            onChange={handleFieldChange}
            className={styles["sign-up-form__textfield"]}
            error={inputHelperText["firstName"].length > 0}
            helperText={inputHelperText["firstName"]}
          />
        </Stack>
        <TextField
          label="Last Name"
          type="text"
          name="lastName"
          value={userDetails["lastName"]}
          onChange={handleFieldChange}
          className={styles["sign-up-form__textfield"]}
          error={inputHelperText["lastName"].length > 0}
          helperText={inputHelperText["lastName"]}
        />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: "2vh" }}
        >
          <TextField
            label="Phone Number"
            type="text"
            name="phoneNumber"
            value={userDetails["phoneNumber"]}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            className={styles["sign-up-form__textfield"]}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">(+94)</InputAdornment>
              ),
            }}
            error={inputHelperText["phoneNumber"].length > 0}
            helperText={inputHelperText["phoneNumber"]}
          />
          <TextField
            label="NIC"
            type="text"
            name="nic"
            value={userDetails["nic"]}
            onChange={handleFieldChange}
            className={styles["sign-up-form__textfield"]}
            error={inputHelperText["nic"].length > 0}
            helperText={inputHelperText["nic"]}
          />
        </Stack>
        <TextField
          label="Address"
          type="text"
          name="address"
          value={userDetails["address"]}
          onChange={handleFieldChange}
          error={inputHelperText["address"].length > 0}
          helperText={inputHelperText["address"]}
        />
        <TextField
          label="Password"
          type={isPasswordShown ? "text" : "password"}
          name="password"
          value={userDetails["password"]}
          onChange={handleFieldChange}
          InputProps={{
            endAdornment: (
              <IconButton edge="end" onClick={toggleShowPassword}>
                {isPasswordShown ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            ),
          }}
          sx={{ mt: 2 }}
          error={inputHelperText["password"].length > 0}
          helperText={inputHelperText["password"]}
        />
        <TextField
          label="Confirm Password"
          type={isConfirmPasswordShown ? "text" : "password"}
          name="confirmPassword"
          value={userDetails["confirmPassword"]}
          onChange={handleFieldChange}
          InputProps={{
            endAdornment: (
              <IconButton edge="end" onClick={toggleShowConfirmPassword}>
                {isConfirmPasswordShown ? (
                  <VisibilityIcon />
                ) : (
                  <VisibilityOffIcon />
                )}
              </IconButton>
            ),
          }}
          error={inputHelperText["confirmPassword"].length > 0}
          helperText={inputHelperText["confirmPassword"]}
        />
        <p className={styles["sign-up-form__error-message"]}>
          &#8203;{errorMessage}
        </p>
        <Button
          variant="contained"
          type="submit"
          sx={{ mt: 1 }}
          disabled={isSubmitting}
        >
          Sign Up
        </Button>
        <p className={styles["sign-up-form__help-text"]}>
          Already have an account?
        </p>
        <Button
          variant="outlined"
          sx={{ mb: 5 }}
          onClick={handleLogInButtonClick}
        >
          Log In
        </Button>
      </Stack>
    </Form>
  );
};

export default SignUpForm;
