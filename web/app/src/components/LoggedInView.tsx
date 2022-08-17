import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
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
            <Box component={Link} to="/" sx={{ textDecoration: "none", color: "text.primary" }}>
              <Typography variant="h3">Time Machine</Typography>
            </Box>
          </Grid>
          <Grid item xs container justifyContent="flex-end">
            <Button color="inherit" disabled>
              {user?.username}
            </Button>
            {user?.is_admin && (
              <>
                <Button color="inherit" variant="text" component={Link} to="/allcheckins">
                  Admin View
                </Button>
                <Button color="inherit" variant="text" component={Link} to="/users">
                  User Management
                </Button>
              </>
            )}
            <LoadingButton loading={loading} color="inherit" variant="text" onClick={handleLogout}>
              Logout
            </LoadingButton>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">{dateFormat(new Date(), "dddd, d mmmm yyyy")}</Typography>
          </Grid>
        </Grid>

        <Outlet />
      </Container>
    </Grid>
  );
}

export default LoggedInView;
