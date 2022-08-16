import { useEffect, useState } from "react";
import { Add, Delete } from "@mui/icons-material";
import { Button, Grid, IconButton, List, ListItem } from "@mui/material";
import dateFormat from "dateformat";
import api from "../../api";
import { useDispatch, useSelector } from "../../store/hooks";
import { selectCheckIns, updateCheckIns } from "../../store/timeSlice";
import { getTimezoneOffsetMillis } from "../../utils/dateTime";
import NewCheckIn from "./NewCheckIn";

function CheckInList() {
  const checkIns = useSelector(selectCheckIns);
  const dispatch = useDispatch();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchCheckIns();
  }, []);

  function fetchCheckIns() {
    api.checkin
      .list()
      .then(res => dispatch(updateCheckIns(res.data)))
      .catch(err => console.error(err.message));
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
          <NewCheckIn fetchCheckIns={fetchCheckIns} exitCreating={() => setCreating(false)} />
        ) : (
          <Grid container justifyContent="center">
            <Button variant="text" color="primary" startIcon={<Add />} onClick={() => setCreating(true)}>
              Check In
            </Button>
          </Grid>
        )}
      </ListItem>
      {checkIns.length > 0 ? (
        checkIns
          .filter(
            c =>
              dateFormat(new Date(), "yyyy-mm-dd") ===
              dateFormat(new Date(c.created - getTimezoneOffsetMillis()), "yyyy-mm-dd"),
          )
          .map(c => (
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
