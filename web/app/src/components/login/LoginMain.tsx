import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Grid, TextField, Typography } from "@mui/material";
import api from "../../api";
import { UserLogin } from "../../api/types/auth";
import { useDispatch } from "../../store/hooks";
import { updateLoggedIn, updateUser } from "../../store/timeSlice";

enum LoginState {
  OK = "",
  RequiredField = "This field is required",
  IncorrectCredentials = "Username and/or password is incorrect",
}

function LoginMain() {
  const initialForm: UserLogin = {
    username: "",
    password: "",
  };
  const initialErrors: { [key in keyof UserLogin]: LoginState } = {
    username: LoginState.OK,
    password: LoginState.OK,
  };
  const [form, setForm] = useState<UserLogin>({ ...initialForm });
  const [formErrors, setFormErrors] = useState<typeof initialErrors>({ ...initialErrors });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  function handleChange(e: any) {
    const { name, value } = e.target;
    setForm(form => ({ ...form, [name]: value }));
  }

  function validateFields() {
    const errors = { ...formErrors };
    (Object.keys(errors) as (keyof UserLogin)[]).forEach(key => {
      errors[key] = !!form[key] ? LoginState.OK : LoginState.RequiredField;
    });
    setFormErrors(errors);
    return errors;
  }

  function handleLogin(e: any) {
    e.preventDefault();
    const errors = validateFields();
    if (Object.values(errors).some(Boolean)) return;
    setLoading(true);
    api.auth
      .login(form)
      .then(res => {
        dispatch(updateLoggedIn(true));
        dispatch(updateUser(res.data));
      })
      .catch(err => {
        console.error(err.message);
        if (err.response.status === 424) {
          setFormErrors(form => ({ ...form, password: LoginState.IncorrectCredentials }));
        }
      })
      .finally(() => setLoading(false));
  }

  function handleReset() {
    setForm({ ...initialForm });
    setFormErrors({ ...initialErrors });
  }

  return (
    <form onSubmit={handleLogin} onReset={handleReset}>
      <Grid container spacing={2}>
        <Grid item xs={12} container justifyContent="center" mb={2}>
          <Typography variant="h3" component="h1">
            Time Machine
          </Typography>
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
          />
        </Grid>
        <Grid item xs={12} container justifyContent="center">
          <LoadingButton variant="contained" color="primary" loading={loading} type="submit" onClick={handleLogin}>
            Login
          </LoadingButton>
        </Grid>
      </Grid>
    </form>
  );
}

export default LoginMain;
