import { Dispatch, SetStateAction, useState } from "react";
import { FilterAlt } from "@mui/icons-material";
import { Button, FormControl, FormControlLabel, Grid, Switch } from "@mui/material";
import { GridToolbarContainer } from "@mui/x-data-grid";
import FiltersControl from "./FiltersControl";

interface AdminTableToolbarProps {
  summary: boolean;
  setSummary: Dispatch<SetStateAction<boolean>>;
}

function AdminTableToolbar({ summary, setSummary }: AdminTableToolbarProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  return (
    <GridToolbarContainer>
      <Grid container>
        <Grid item xs>
          <Button
            variant="text"
            color="primary"
            startIcon={<FilterAlt />}
            onClick={e => (!!anchorEl ? setAnchorEl(null) : setAnchorEl(e.currentTarget))}
          >
            Filters
          </Button>
          <FiltersControl open={!!anchorEl} anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />
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
