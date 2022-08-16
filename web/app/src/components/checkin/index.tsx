import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Button, Container, Grid, Typography } from "@mui/material";
import dateFormat from "dateformat";
import api from "../../api";
import { useDispatch, useSelector } from "../../store/hooks";
import { selectUser, updateLoggedIn, updateUser } from "../../store/timeSlice";
import CheckInList from "./CheckInList";
import Stats from "./Stats";

function CheckInView() {
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  function handleLogout() {
    setLoading(true);
    api.auth.logout().finally(() => {
      dispatch(updateUser(null));
      dispatch(updateLoggedIn(false));
      setLoading(false);
    });
  }

  return (
    <>
      <Grid container spacing={1} my={5}>
        <Container maxWidth="lg">
          <Grid container>
            <Grid item xs>
              <Typography variant="h4">Welcome, {user?.username}!</Typography>
            </Grid>
            <Grid item xs container justifyContent="flex-end">
              {user?.is_admin && (
                <Button color="inherit" variant="text">
                  Admin View
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

          <Grid container spacing={2} my={2}>
            <Grid item xs={7}>
              <CheckInList />
            </Grid>
            <Grid item xs>
              <Stats />
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </>
  );
}

export default CheckInView;
