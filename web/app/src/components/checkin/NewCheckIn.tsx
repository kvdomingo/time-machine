import { useEffect, useState } from "react";
import { Add, Check, Close } from "@mui/icons-material";
import { Autocomplete, Button, Grid, IconButton, TextField } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import moment from "moment";
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
  tagCache: string[];
}

function NewCheckIn({ fetchCheckIns, tagCache }: NewCheckInProps) {
  const initialCheckIn: CheckInForm = {
    duration: 0,
    start_time: moment().format("HH:mm"),
    record_date: moment().format("YYYY-MM-DD"),
    tag: "",
    activities: "",
  };
  const initialErrors: { [key in keyof CheckInForm]: CheckInStatus } = {
    duration: CheckInStatus.OK,
    start_time: CheckInStatus.OK,
    record_date: CheckInStatus.OK,
    tag: CheckInStatus.OK,
    activities: CheckInStatus.OK,
  };

  const [endTime, setEndTime] = useState(moment().format("HH:mm"));
  const [newCheckInData, setNewCheckInData] = useState({ ...initialCheckIn });
  const [formErrors, setFormErrors] = useState<typeof initialErrors>({ ...initialErrors });
  const [creating, setCreating] = useState(false);
  const [tagInputValue, setTagInputValue] = useState("");

  useEffect(() => {
    let _startTime = moment(newCheckInData.start_time, "HH:mm");
    const _endTime = moment(_startTime).add(newCheckInData.duration, "hours");
    if (_endTime.format("HH:mm") !== endTime) setEndTime(_endTime.format("HH:mm"));
  }, [newCheckInData.duration]);

  useEffect(() => {
    let _startTime = moment(newCheckInData.start_time, "HH:mm");
    let _endTime = moment(endTime, "HH:mm");
    if (_startTime.isAfter(_endTime)) {
      _startTime = moment(_endTime);
    }
    let diff = (_endTime.valueOf() - _startTime.valueOf()) / 1000 / 60 / 60;
    if (isNaN(diff)) diff = 0;
    if (newCheckInData.duration !== diff)
      setNewCheckInData(form => ({
        ...form,
        duration: diff,
        start_time: _startTime.format("HH:mm"),
      }));
  }, [newCheckInData.start_time]);

  useEffect(() => {
    let _startTime = moment(newCheckInData.start_time, "HH:mm");
    let _endTime = moment(endTime, "HH:mm");
    if (_endTime.isBefore(_startTime)) {
      _endTime = moment(_startTime);
      if (_endTime.format("HH:mm") !== endTime) setEndTime(_endTime.format("HH:mm"));
    }
    let diff = (_endTime.valueOf() - _startTime.valueOf()) / 1000 / 60 / 60;
    if (isNaN(diff)) diff = 0;
    if (newCheckInData.duration !== diff)
      setNewCheckInData(form => ({
        ...form,
        duration: diff,
      }));
  }, [endTime]);

  function handleChange(e: any, _name?: string, _value?: string | null) {
    let name = _name != null ? _name : e.target.name;
    let value = _value != null ? _value : e.target.value;
    setNewCheckInData(form => ({
      ...form,
      [name]: value,
    }));
  }

  function handleConfirmChange(e: any, _name?: string, _value?: string | null) {
    let name = _name != null ? _name : e.target.name;
    let value = _value != null ? _value : e.target.value;
    setNewCheckInData(form => ({
      ...form,
      [name]:
        name === "duration"
          ? !value || isNaN(parseFloat(value))
            ? 0.0
            : parseFloat(value)
          : name === "tag"
          ? value.replace(/\s+/g, "-")
          : value,
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

  return creating ? (
    <form onSubmit={handleCreateCheckIn}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={2}>
          <Autocomplete
            freeSolo
            fullWidth
            renderInput={params => (
              <TextField
                {...params}
                autoFocus
                label="Tag"
                name="tag"
                error={!!formErrors.tag}
                helperText={formErrors.tag}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: "#",
                }}
              />
            )}
            options={tagCache}
            getOptionLabel={option => option}
            inputValue={tagInputValue}
            onInputChange={(e, val) => setTagInputValue(val)}
            value={newCheckInData.tag}
            onChange={(e, val) => handleConfirmChange(e, "tag", val)}
            onBlur={e => handleConfirmChange(e, "tag")}
            disableClearable
          />
        </Grid>
        <Grid item xs={12} md={3.5}>
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
        <Grid item xs={12} md={1.75}>
          <TimePicker
            onChange={val => handleConfirmChange(null, "start_time", val?.format("HH:mm") ?? "00:00")}
            value={moment(newCheckInData.start_time, "HH:mm")}
            renderInput={params => <TextField {...params} />}
            label="Start time"
            inputFormat="HH:mm"
          />
        </Grid>
        <Grid item xs={12} md={1.75}>
          <TimePicker
            onChange={val => setEndTime(val?.format("HH:mm") ?? "00:00")}
            value={moment(endTime, "HH:mm")}
            renderInput={params => <TextField {...params} />}
            label="End time"
            inputFormat="HH:mm"
          />
        </Grid>
        <Grid item xs={12} md={1.5}>
          <TextField
            label="Duration"
            variant="outlined"
            InputProps={{ endAdornment: "hrs" }}
            name="duration"
            value={newCheckInData.duration}
            inputMode="numeric"
            onChange={handleChange}
            onBlur={handleConfirmChange}
            error={!!formErrors.duration}
            helperText={formErrors.duration}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md container alignItems="center" justifyContent={{ xs: "center", md: "flex-end" }}>
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
  );
}

export default NewCheckIn;
