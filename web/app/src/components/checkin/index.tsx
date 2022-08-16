import { Grid } from "@mui/material";
import CheckInList from "./CheckInList";
import Stats from "./Stats";

function CheckInView() {
  return (
    <Grid container spacing={2} my={2}>
      <Grid item xs={7}>
        <CheckInList />
      </Grid>
      <Grid item xs>
        <Stats />
      </Grid>
    </Grid>
  );
}

export default CheckInView;
