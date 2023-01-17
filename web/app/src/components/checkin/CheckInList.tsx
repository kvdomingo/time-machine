import { Dispatch, SetStateAction } from "react";
import { Delete } from "@mui/icons-material";
import { Grid, IconButton, List, ListItem, Pagination, Typography } from "@mui/material";
import moment from "moment";
import api from "../../api";
import { useSelector } from "../../store/hooks";
import { selectCheckIns } from "../../store/timeSlice";
import { DEFAULT_TIME_FORMAT } from "../../utils/constants";
import NewCheckIn from "./NewCheckIn";

interface CheckInListProps {
  count: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  fetchCheckIns: (page?: number) => void;
  tagCache: string[];
}

function CheckInList({ count, page, fetchCheckIns, tagCache, setPage }: CheckInListProps) {
  const checkIns = useSelector(selectCheckIns);

  function handleDeleteCheckIn(id: string) {
    api.checkin
      .delete(id)
      .then(() => fetchCheckIns())
      .catch(err => console.error(err.message));
  }

  function handlePageChange(e: any, page: number) {
    setPage(page);
    fetchCheckIns(page);
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
          <NewCheckIn fetchCheckIns={fetchCheckIns} tagCache={tagCache} />
        </ListItem>
        {checkIns.length > 0 ? (
          checkIns.map(c => (
            <ListItem key={c.id}>
              <Grid container alignItems="center">
                <Grid item xs={12} md={1}>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {moment(c.created).format("MM/DD")}
                  </Typography>
                </Grid>
                <Grid item xs md container alignItems="center">
                  <Typography variant="body1">
                    {c.duration.toFixed(3)} {c.duration === 1 ? "hr" : "hrs"}{" "}
                  </Typography>
                  <Typography variant="body1" mx={1} color="primary">
                    #{c.tag}
                  </Typography>
                  <Typography variant="body1">{c.activities}</Typography>
                  <Typography variant="body1" ml={1}>
                    ({moment(c.start_time, "HH:mm:ss").format(DEFAULT_TIME_FORMAT)} -{" "}
                    {moment(c.start_time, "HH:mm:ss").add(c.duration, "hours").format("HH:mm")})
                  </Typography>
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
        <Pagination count={Math.ceil(count / 10)} page={page} onChange={handlePageChange} />
      </Grid>
    </>
  );
}

export default CheckInList;
