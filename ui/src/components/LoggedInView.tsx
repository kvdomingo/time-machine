import { Outlet } from "react-router-dom";

import { Container, Grid, Typography } from "@mui/material";
import dateFormat from "dateformat";

function LoggedInView() {
  return (
    <Grid container spacing={1} my={5} px={4}>
      <Container maxWidth={false}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h4">
              {dateFormat(new Date(), "dddd, d mmmm yyyy")}
            </Typography>
          </Grid>
        </Grid>

        <Outlet />
      </Container>
    </Grid>
  );
}

export default LoggedInView;
