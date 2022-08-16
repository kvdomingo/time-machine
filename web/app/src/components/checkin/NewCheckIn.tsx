import { useState } from "react";
import { Check, Close } from "@mui/icons-material";
import { Grid, IconButton, TextField } from "@mui/material";
import api from "../../api";
import { CheckInForm } from "../../api/types/checkIn";

enum CheckInStatus {
  OK = "",
  RequiredField = "This field is required",
  NumberOnly = "This field should be a positive number",
  NoSpaces = "This field cannot contain spaces",
}

interface NewCheckInProps {
  fetchCheckIns: () => void;
  exitCreating: () => void;
}

function NewCheckIn({ fetchCheckIns, exitCreating }: NewCheckInProps) {
  const initialCheckIn: CheckInForm = {
    duration: 0,
    tag: "",
    activities: "",
  };
  const initialErrors: { [key in keyof CheckInForm]: CheckInStatus } = {
    duration: CheckInStatus.OK,
    tag: CheckInStatus.OK,
    activities: CheckInStatus.OK,
  };

  const [newCheckInData, setNewCheckInData] = useState({ ...initialCheckIn });
  const [formErrors, setFormErrors] = useState<typeof initialErrors>({ ...initialErrors });

  function handleChange(e: any) {
    const { name, value } = e.target;
    setNewCheckInData(form => ({
      ...form,
      [name]: name === "duration" ? (value.endsWith(".") ? parseFloat(`${value}5`) : parseFloat(value)) : value,
    }));
  }

  function validateForm() {
    const errors = { ...formErrors };
    (Object.keys(errors) as (keyof CheckInForm)[]).forEach(key => {
      if (key === "duration") {
        errors.duration =
          !isNaN(parseFloat(String(newCheckInData.duration))) && parseFloat(String(newCheckInData.duration)) > 0
            ? CheckInStatus.OK
            : CheckInStatus.NumberOnly;
      } else if (key === "tag") {
        errors.tag =
          newCheckInData.tag.length > 0
            ? !/\s+/g.test(newCheckInData.tag)
              ? CheckInStatus.OK
              : CheckInStatus.NoSpaces
            : CheckInStatus.RequiredField;
      } else {
        errors[key] = (newCheckInData[key] as string).length > 0 ? CheckInStatus.OK : CheckInStatus.RequiredField;
      }
    });
    setFormErrors(errors);
    return errors;
  }

  function handleCreateCheckIn(e: any) {
    e.preventDefault();
    const errors = validateForm();
    if (Object.values(errors).some(Boolean)) return;
    api.checkin
      .create(newCheckInData)
      .then(() => {
        fetchCheckIns();
        exitCreating();
        setNewCheckInData({ ...initialCheckIn });
      })
      .catch(err => console.error(err));
  }

  return (
    <form onSubmit={handleCreateCheckIn}>
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <TextField
            autoFocus
            label="Duration"
            variant="outlined"
            InputProps={{ endAdornment: "hrs" }}
            name="duration"
            value={newCheckInData.duration}
            inputMode="numeric"
            onChange={handleChange}
            error={!!formErrors.duration}
            helperText={formErrors.duration}
          />
        </Grid>
        <Grid item xs>
          <TextField
            label="Tag"
            variant="outlined"
            InputProps={{ startAdornment: "#" }}
            name="tag"
            value={newCheckInData.tag}
            onChange={handleChange}
            error={!!formErrors.tag}
            helperText={formErrors.tag}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Activities"
            variant="outlined"
            name="activities"
            value={newCheckInData.activities}
            onChange={handleChange}
            fullWidth
            error={!!formErrors.activities}
            helperText={formErrors.activities}
          />
        </Grid>
        <Grid item xs={2} container alignItems="center" justifyContent="flex-end">
          <IconButton
            onClick={() => {
              setNewCheckInData({ ...initialCheckIn });
              exitCreating();
            }}
          >
            <Close />
          </IconButton>
          <IconButton type="submit" onClick={() => handleCreateCheckIn}>
            <Check />
          </IconButton>
        </Grid>
      </Grid>
    </form>
  );
}

export default NewCheckIn;
