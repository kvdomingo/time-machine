import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AccountCircle } from "@mui/icons-material";
import { Avatar, Grid } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColumns } from "@mui/x-data-grid";
import { cloneDeep } from "lodash-es";
import api from "../../api";
import { UserResponse } from "../../api/types/auth";
import { useDispatch, useSelector } from "../../store/hooks";
import { selectAllUsers, updateAllUsers } from "../../store/timeSlice";
import ConfirmAdminDialog from "./ConfirmAdminDialog";

function UserManagement() {
  const dispatch = useDispatch();
  const users = cloneDeep(useSelector(selectAllUsers)).sort((a, b) => a.username.localeCompare(b.username));
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const columns: GridColumns = [
    {
      field: "username",
      headerName: "User",
      flex: 1,
      renderCell: ({ value }) => (
        <Grid container alignItems="center">
          <Avatar sx={{ mr: 1 }}>{value[0].toUpperCase()}</Avatar>
          {value}
        </Grid>
      ),
    },
    {
      field: "is_admin",
      headerName: "Access Level",
      flex: 1,
      valueFormatter: ({ value }) => (value ? "Admin" : "Regular"),
    },
    {
      field: "",
      flex: 0.25,
      type: "actions",
      getActions: ({ row }: { row: UserResponse }) => [
        <GridActionsCellItem
          icon={<AccountCircle />}
          label={row.is_admin ? "Remove from admin" : "Make admin"}
          showInMenu
          onClick={() => {
            setSelectedUser(row);
            setOpenConfirmDialog(true);
          }}
        />,
      ],
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  function fetchUsers() {
    api.user
      .list()
      .then(res => dispatch(updateAllUsers(res.data)))
      .catch(err => console.error(err.message));
  }

  return (
    <>
      <Helmet>
        <title>User Management | Time Machine</title>
      </Helmet>
      <Grid container spacing={2} my={2} sx={{ height: "80vh" }}>
        <DataGrid columns={columns} rows={users} rowsPerPageOptions={[]} autoPageSize disableSelectionOnClick />
      </Grid>
      <ConfirmAdminDialog
        open={openConfirmDialog}
        onClose={() => {
          setOpenConfirmDialog(false);
          setSelectedUser(null);
        }}
        selectedUser={selectedUser}
        refresh={fetchUsers}
      />
    </>
  );
}

export default UserManagement;
