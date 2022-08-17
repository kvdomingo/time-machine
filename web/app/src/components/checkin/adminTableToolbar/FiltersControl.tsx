import { useState } from "react";
import {
  Button,
  Checkbox,
  Fade,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Popper,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { useDispatch, useSelector } from "../../../store/hooks";
import { selectAdminViewFilters, selectAllCheckIns, updateAdminViewFilters } from "../../../store/timeSlice";

interface FiltersControlProps {
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
}

function FiltersControl({ open, anchorEl, onClose }: FiltersControlProps) {
  const dispatch = useDispatch();
  const checkIns = useSelector(selectAllCheckIns);
  const filters = useSelector(selectAdminViewFilters);
  const uniqueUsers = [...new Set(checkIns.map(c => c.author))].sort();
  const uniqueTags = [...new Set(checkIns.map(c => c.tag))].sort();
  const [selectedUsers, setSelectedUsers] = useState<string[]>(filters.users);
  const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags);
  const [startDate, setStartDate] = useState(moment(filters.startDate));
  const [endDate, setEndDate] = useState(moment(filters.endDate));

  function handleCancel() {
    setSelectedUsers([]);
    setSelectedTags([]);
    setStartDate(moment().startOf("isoWeek"));
    setEndDate(moment().endOf("day"));
    onClose();
  }

  function handleApply() {
    dispatch(
      updateAdminViewFilters({
        startDate: startDate.valueOf(),
        endDate: endDate.valueOf(),
        tags: selectedTags,
        users: selectedUsers,
      }),
    );
    onClose();
  }

  return (
    <Popper open={open} anchorEl={anchorEl} placement="bottom-start" transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={300}>
          <Paper sx={{ width: 400 }}>
            <Grid container p={2} spacing={1}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Users</InputLabel>
                  <Select
                    multiple
                    value={selectedUsers}
                    onChange={e =>
                      setSelectedUsers(typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value)
                    }
                    input={<OutlinedInput label="Users" />}
                    renderValue={selected => selected.join(", ")}
                  >
                    {uniqueUsers.map(u => (
                      <MenuItem key={u} value={u}>
                        <Checkbox checked={selectedUsers.includes(u)} />
                        <ListItemText primary={u} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tags</InputLabel>
                  <Select
                    multiple
                    value={selectedTags}
                    onChange={e =>
                      setSelectedTags(typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value)
                    }
                    input={<OutlinedInput label="Tags" />}
                    renderValue={selected => selected.join(", ")}
                  >
                    {uniqueTags.map(t => (
                      <MenuItem key={t} value={t}>
                        <Checkbox checked={selectedTags.includes(t)} />
                        <ListItemText primary={t} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  onChange={value => setStartDate(value!.startOf("day"))}
                  value={startDate}
                  renderInput={params => <TextField {...params} fullWidth label="Start date" />}
                  disableFuture
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  onChange={value => setEndDate(value!.endOf("day"))}
                  value={endDate}
                  renderInput={params => <TextField {...params} fullWidth label="End date" />}
                />
              </Grid>
              <Grid item xs={12} container justifyContent="flex-end">
                <Button variant="text" color="inherit" sx={{ mr: 1 }} onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleApply}>
                  Apply
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
}

export default FiltersControl;
