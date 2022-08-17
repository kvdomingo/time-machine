import { useEffect, useState } from "react";
import { Avatar, Grid, Typography } from "@mui/material";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import dateFormat from "dateformat";
import moment from "moment";
import api from "../../api";
import { useDispatch, useSelector } from "../../store/hooks";
import { selectAllCheckIns, updateAllCheckIns } from "../../store/timeSlice";
import { getTimezoneOffsetMillis } from "../../utils/dateTime";
import Loading from "../shared/Loading";
import AdminTableToolbar from "./AdminTableToolbar";

interface SummaryData {
  author: string;
  timeLogged: number;
}

function AdminView() {
  const checkIns = useSelector(selectAllCheckIns);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(false);
  const columns: GridColumns = [
    {
      field: "author",
      headerName: "User",
      flex: 0.5,
      renderCell: ({ value }) => (
        <Grid container alignItems="center">
          <Avatar sx={{ mr: 1 }}>{value[0].toUpperCase()}</Avatar>
          {value}
        </Grid>
      ),
    },
    {
      field: "duration",
      headerName: "Check In",
      renderCell: ({ row }) => `${row.duration} ${row.duration === 1 ? "hr" : "hrs"} #${row.tag} ${row.activities}`,
      flex: 1,
    },
    {
      field: "created",
      headerName: "Time Reported",
      valueFormatter: ({ value }) => dateFormat(new Date(value - getTimezoneOffsetMillis()), "yyyy-mm-dd HH:MM:ss"),
      flex: 0.5,
    },
  ];
  const summaryColumns: GridColumns = [
    {
      field: "author",
      headerName: "User",
      flex: 1,
      renderCell: ({ value, row }) => (
        <Grid container alignItems="center">
          <Avatar sx={{ mr: 1 }}>{value[0].toUpperCase()}</Avatar>
          <Typography sx={{ fontWeight: row.timeLogged >= 45 ? "bold" : undefined }}>{value}</Typography>
        </Grid>
      ),
    },
    {
      field: "timeLogged",
      headerName: "Time logged this week",
      flex: 1,
      renderCell: ({ value }) => (
        <Typography sx={{ fontWeight: value >= 45 ? "bold" : undefined }}>
          {value} {value === 1 ? "hr" : "hrs"}
        </Typography>
      ),
    },
  ];
  const checkInsForTheWeek = checkIns.filter(c =>
    moment(c.created - getTimezoneOffsetMillis()).isSameOrAfter(moment().startOf("isoWeek")),
  );
  const uniqueUsers = [...new Set(checkIns.map(c => c.author))];
  const summaryRows: SummaryData[] = uniqueUsers
    .map(u => ({
      id: u,
      author: u,
      timeLogged: checkInsForTheWeek
        .filter(c => c.author === u)
        .map(c => c.duration)
        .reduce((acc, val) => acc + val, 0),
    }))
    .sort((a, b) => a.author.localeCompare(b.author));

  useEffect(() => {
    api.checkin
      .listAll()
      .then(res => dispatch(updateAllCheckIns(res.data)))
      .catch(err => console.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Grid container my={2} alignItems="center" justifyContent="center" sx={{ height: "80vh" }}>
      {loading ? (
        <Loading width="6em" />
      ) : (
        <DataGrid
          columns={summary ? summaryColumns : columns}
          rows={summary ? summaryRows : checkIns}
          rowsPerPageOptions={[]}
          autoPageSize
          disableSelectionOnClick
          components={{ Toolbar: () => <AdminTableToolbar summary={summary} setSummary={setSummary} /> }}
        />
      )}
    </Grid>
  );
}

export default AdminView;
