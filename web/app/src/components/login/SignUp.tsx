import { useEffect, useState } from "react";
import { Check, Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Grid, List, ListItem, ListItemIcon, ListItemText, TextField, Typography } from "@mui/material";
import api from "../../api";
import { UserSignup } from "../../api/types/auth";
import { useDispatch } from "../../store/hooks";
import { updateGlobalNotification } from "../../store/timeSlice";

enum SignUpState {
  OK = "",
  RequiredField = "This field is required",
  InvalidEmail = "Invalid email format",
  WeakPassword = "Password is too weak",
}

type passwordValidationCriteria = "length" | "uppercase" | "lowercase" | "number" | "special";

type passwordValidationState = {
  [key in passwordValidationCriteria]: {
    text: string;
    valid: boolean;
  };
};

interface SignUpProps {
  goToLogin: () => void;
}

function SignUp({ goToLogin }: SignUpProps) {
  const initialForm: UserSignup = {
    email: "",
    username: "",
    password: "",
  };
  const initialErrors: { [key in keyof UserSignup]: SignUpState } = {
    email: SignUpState.OK,
    username: SignUpState.OK,
    password: SignUpState.OK,
  };
  const initialPasswordValidationState: passwordValidationState = {
    length: {
      text: "At least 8 characters in length",
      valid: false,
    },
    uppercase: {
      text: "At least 1 uppercase letter",
      valid: false,
    },
    lowercase: {
      text: "At least 1 lowercase letter",
      valid: false,
    },
    number: {
      text: "At least 1 number",
      valid: false,
    },
    special: {
      text: "At least 1 special character",
      valid: false,
    },
  };
  const [passwordValidationState, setPasswordValidationState] = useState<passwordValidationState>({
    ...initialPasswordValidationState,
  });
  const [form, setForm] = useState<UserSignup>({ ...initialForm });
  const [formErrors, setFormErrors] = useState<typeof initialErrors>({ ...initialErrors });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    validatePassword();
  }, [form.password]);

  function handleChange(e: any) {
    const { name, value } = e.target;
    if (name === "confirmPassword") return setConfirmPassword(value);
    setForm(form => ({ ...form, [name]: value }));
  }

  function validatePassword() {
    let validation = { ...passwordValidationState };
    validation.length.valid = form.password.length >= 8;
    validation.uppercase.valid = /[A-Z]+/g.test(form.password);
    validation.lowercase.valid = /[a-z]+/g.test(form.password);
    validation.number.valid = /\d+/g.test(form.password);
    validation.special.valid = /[^\w\s]+/g.test(form.password);
    setPasswordValidationState(validation);
    return validation;
  }

  function validateFields() {
    const errors = { ...formErrors };

    // Email
    if (form.email.length === 0) {
      errors.email = SignUpState.RequiredField;
    } else if (
      !/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test(
        form.email,
      )
    ) {
      errors.email = SignUpState.InvalidEmail;
    } else {
      errors.email = SignUpState.OK;
    }

    // Username
    errors.username = form.username.length > 0 ? SignUpState.OK : SignUpState.RequiredField;

    // Password
    if (form.password.length === 0) {
      errors.password = SignUpState.RequiredField;
    } else if (
      Object.values(passwordValidationState)
        .map(val => !val.valid)
        .some(Boolean)
    ) {
      errors.password = SignUpState.WeakPassword;
    } else {
      errors.password = SignUpState.OK;
    }

    setFormErrors(errors);
    return errors;
  }

  function handleSignup(e: any) {
    e.preventDefault();
    const errors = validateFields();
    if (Object.values(errors).some(Boolean) || confirmPassword.length === 0) return;
    setLoading(true);
    api.auth
      .signUp(form)
      .then(() => {
        dispatch(
          updateGlobalNotification({
            type: "success",
            visible: true,
            message: "You may now log in with your new credentials",
          }),
        );
        goToLogin();
      })
      .catch(err => {
        console.error(err.message);
      })
      .finally(() => setLoading(false));
  }

  function handleReset() {
    setForm({ ...initialForm });
    setFormErrors({ ...initialErrors });
  }

  return (
    <form onSubmit={handleSignup} onReset={handleReset} autoComplete="off">
      <input autoComplete="false" type="hidden" />
      <Grid container spacing={1}>
        <Grid item xs={12} container justifyContent="center" mb={2}>
          <Typography variant="h3" component="h1">
            Time Machine
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            name="email"
            value={form.email}
            variant="outlined"
            fullWidth
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Username"
            name="username"
            value={form.username}
            variant="outlined"
            fullWidth
            onChange={handleChange}
            error={!!formErrors.username}
            helperText={formErrors.username}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            variant="outlined"
            fullWidth
            onChange={handleChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Your password must have:
            <List dense disablePadding>
              {Object.values(passwordValidationState).map((state, i) => (
                <ListItem key={i} disablePadding>
                  <ListItemIcon>
                    {state.valid ? (
                      <Check fontSize="small" color="success" />
                    ) : (
                      <Close fontSize="small" color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    disableTypography
                    primary={state.text}
                    sx={{ color: state.valid ? "success.main" : "error.main" }}
                  />
                </ListItem>
              ))}
            </List>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Repeat password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            variant="outlined"
            fullWidth
            onChange={handleChange}
            error={form.password !== confirmPassword}
            helperText={form.password !== confirmPassword && "Passwords do not match"}
            required
          />
        </Grid>
        <Grid item xs={12} container justifyContent="center" mt={2}>
          <LoadingButton variant="contained" color="primary" loading={loading} type="submit" onClick={handleSignup}>
            Sign up
          </LoadingButton>
        </Grid>
      </Grid>
    </form>
  );
}

export default SignUp;
