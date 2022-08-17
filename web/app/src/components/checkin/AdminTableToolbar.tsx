import { Dispatch, SetStateAction } from "react";
import { FormControl, FormControlLabel, Grid, Switch } from "@mui/material";
import { GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";

interface AdminTableToolbarProps {
  summary: boolean;
  setSummary: Dispatch<SetStateAction<boolean>>;
}

function AdminTableToolbar({ summary, setSummary }: AdminTableToolbarProps) {
  return (
    <GridToolbarContainer>
      <Grid container>
        <Grid item xs>
          <GridToolbar />
        </Grid>
        <Grid item xs container justifyContent="flex-end">
          <FormControl component="fieldset">
            <FormControlLabel
              value={summary}
              control={<Switch checked={summary} onChange={e => setSummary(e.target.checked)} />}
              label="View total hours"
            />
          </FormControl>
        </Grid>
      </Grid>
    </GridToolbarContainer>
  );
}

export default AdminTableToolbar;
