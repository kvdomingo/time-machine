import { useEffect, useState } from "react";
import { Add, Check, Close, Delete } from "@mui/icons-material";
import { Button, Grid, IconButton, List, ListItem, TextField } from "@mui/material";
import api from "../../api";
import { CheckInForm } from "../../api/types/checkIn";
import { useDispatch, useSelector } from "../../store/hooks";
import { selectCheckIns, updateCheckIns } from "../../store/timeSlice";

enum CheckInStatus {
  OK = "",
  RequiredField = "This field is required",
  NumberOnly = "This field should be a positive number",
  NoSpaces = "This field cannot contain spaces",
}

function CheckInList() {
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
  const checkIns = useSelector(selectCheckIns);
  const dispatch = useDispatch();
  const [creating, setCreating] = useState(false);
  const [newCheckInData, setNewCheckInData] = useState({ ...initialCheckIn });
  const [formErrors, setFormErrors] = useState<typeof initialErrors>({ ...initialErrors });

  useEffect(() => {
    fetchCheckIns();
  }, []);

  function fetchCheckIns() {
    api.checkin
      .list()
      .then(res => dispatch(updateCheckIns(res.data)))
      .catch(err => console.error(err.message));
  }

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
        setCreating(false);
        setNewCheckInData({ ...initialCheckIn });
      })
      .catch(err => console.error(err));
  }

  function handleDeleteCheckIn(id: string) {
    api.checkin
      .delete(id)
      .then(fetchCheckIns)
      .catch(err => console.error(err.message));
  }

  return (
    <List
      sx={{
        "& li": {
          border: "1px solid #DDD",
        },
        "& li:first-child": {
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        },
        "& li:last-child": {
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
        },
      }}
    >
      <ListItem>
        {creating ? (
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
                    setCreating(false);
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
        ) : (
          <Grid container justifyContent="center">
            <Button variant="text" color="primary" startIcon={<Add />} onClick={() => setCreating(true)}>
              Check In
            </Button>
          </Grid>
        )}
      </ListItem>
      {checkIns.length > 0 ? (
        checkIns.map(c => (
          <ListItem key={c.id}>
            <Grid container alignItems="center">
              <Grid item xs>
                {c.duration} {c.duration === 1 ? "hr" : "hrs"} #{c.tag} {c.activities}
              </Grid>
              <Grid item xs={2} container justifyContent="flex-end">
                <IconButton color="error" onClick={() => handleDeleteCheckIn(c.id)}>
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          </ListItem>
        ))
      ) : (
        <ListItem sx={{ color: "text.secondary" }}>No check ins within the selected time period</ListItem>
      )}
    </List>
  );
}

export default CheckInList;
