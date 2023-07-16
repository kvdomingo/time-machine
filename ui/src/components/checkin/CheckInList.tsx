import { Dispatch, SetStateAction } from "react";

import { Grid, List, ListItem, Pagination } from "@mui/material";

import useFetchCheckIns from "@/hooks/useFetchCheckIns";
import { useSelector } from "@/store/hooks.ts";
import { selectCheckIns, selectCount } from "@/store/timeSlice.ts";

import CheckInAddEdit from "./CheckInAddEdit";
import CheckInItem from "./CheckInItem";

interface CheckInListProps {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}

function CheckInList({ page, setPage }: CheckInListProps) {
  const checkIns = useSelector(selectCheckIns);
  const fetchCheckIns = useFetchCheckIns();
  const count = useSelector(selectCount);

  function handlePageChange(page: number) {
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
          <CheckInAddEdit />
        </ListItem>
        {checkIns.length > 0 ? (
          checkIns.map(c => <CheckInItem checkIn={c} key={c.id} />)
        ) : (
          <ListItem sx={{ color: "text.secondary" }}>
            No check ins within the selected time period
          </ListItem>
        )}
      </List>
      <Grid container justifyContent="center">
        <Pagination
          count={Math.ceil(count / 10)}
          page={page}
          onChange={(_, page) => handlePageChange(page)}
        />
      </Grid>
    </>
  );
}

export default CheckInList;
