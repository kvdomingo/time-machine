import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Button, Container, Grid, Typography } from "@mui/material";
import dateFormat from "dateformat";
import api from "../api";
import { useDispatch, useSelector } from "../store/hooks";
import { resetTimeMachine, selectUser, updateLoggedIn } from "../store/timeSlice";

function LoggedInView() {
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    setLoading(true);
    api.auth.logout().finally(() => {
      dispatch(resetTimeMachine());
      dispatch(updateLoggedIn(false));
      setLoading(false);
      if (location.pathname !== "/") navigate("/");
    });
  }

  return (
    <Grid container spacing={1} my={5}>
      <Container maxWidth="lg">
        <Grid container>
          <Grid item xs>
            <Typography variant="h4">Welcome, {user?.username}!</Typography>
          </Grid>
          <Grid item xs container justifyContent="flex-end">
            {user?.is_admin && (
              <Button
                color="inherit"
                variant="text"
                component={Link}
                to={location.pathname === "/allcheckins" ? "/" : "/allcheckins"}
              >
                {location.pathname === "/allcheckins" ? "Exit Admin View" : "Admin View"}
              </Button>
            )}
            <LoadingButton loading={loading} color="inherit" variant="text" onClick={handleLogout}>
              Logout
            </LoadingButton>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Today is {dateFormat(new Date(), "dddd, d mmmm yyyy")}</Typography>
          </Grid>
        </Grid>

        <Outlet />
      </Container>
    </Grid>
  );
}

export default LoggedInView;
