import { Link, Outlet } from "react-router-dom";
import { Box, Container, Grid, Typography } from "@mui/material";
import dateFormat from "dateformat";

function LoggedInView() {
  return (
    <Grid container spacing={1} my={5} px={4}>
      <Container maxWidth={false}>
        <Grid container>
          <Grid item xs>
            <Box component={Link} to="/" sx={{ textDecoration: "none", color: "text.primary" }}>
              <Typography variant="h3">Time Machine</Typography>
            </Box>
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
