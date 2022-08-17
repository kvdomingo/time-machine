import { useEffect, useState } from "react";
import { Delete } from "@mui/icons-material";
import { Button, Grid, IconButton, List, ListItem, Pagination, Typography } from "@mui/material";
import moment from "moment";
import api from "../../api";
import { CheckInResponse } from "../../api/types/checkIn";
import { useDispatch } from "../../store/hooks";
import { updateCheckIns } from "../../store/timeSlice";
import { getTimezoneOffsetMillis } from "../../utils/dateTime";
import NewCheckIn from "./NewCheckIn";

interface CheckInListProps {
  checkIns: CheckInResponse[];
  setSelectedTag: (tag: string) => void;
}

function CheckInList({ checkIns, setSelectedTag }: CheckInListProps) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCheckIns();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [checkIns]);

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
    <>
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
          <NewCheckIn fetchCheckIns={fetchCheckIns} />
        </ListItem>
        {checkIns.length > 0 ? (
          checkIns.slice((page - 1) * 10, (page - 1) * 10 + 10).map(c => (
            <ListItem key={c.id}>
              <Grid container alignItems="center">
                <Grid item xs={12} md={1}>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {moment(c.created - getTimezoneOffsetMillis()).format("MM/DD")}
                  </Typography>
                </Grid>
                <Grid item xs md container alignItems="center">
                  <Typography variant="body1">
                    {c.duration} {c.duration === 1 ? "hr" : "hrs"}{" "}
                  </Typography>
                  <Button
                    variant="text"
                    sx={{ textTransform: "none", py: 0, px: 1 }}
                    onClick={() => setSelectedTag(c.tag)}
                  >
                    <Typography variant="body1">#{c.tag}</Typography>
                  </Button>{" "}
                  <Typography variant="body1">{c.activities}</Typography>
                </Grid>
                <Grid item xs={2} md={2} container justifyContent={{ md: "flex-end" }}>
                  <IconButton color="error" onClick={() => handleDeleteCheckIn(c.id)} size="small">
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
      <Grid container justifyContent="center">
        <Pagination count={Math.ceil(checkIns.length / 10)} page={page} onChange={(e, value) => setPage(value)} />
      </Grid>
    </>
  );
}

export default CheckInList;
