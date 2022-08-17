import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import api from "../../api";
import { UserResponse } from "../../api/types/auth";
import { useDispatch } from "../../store/hooks";
import { updateGlobalNotification } from "../../store/timeSlice";

interface ConfirmAdminDialogProps {
  open: boolean;
  onClose: () => void;
  selectedUser: UserResponse | null;
  refresh: () => void;
}

function ConfirmAdminDialog({ open, onClose, selectedUser, refresh }: ConfirmAdminDialogProps) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  function handleChangeAdmin() {
    setLoading(true);
    let is_admin = !selectedUser!.is_admin;
    api.user
      .updateIsAdmin(selectedUser!.username, { is_admin })
      .then(() => {
        refresh();
        dispatch(
          updateGlobalNotification({
            type: "success",
            visible: true,
            message: `Successfully changed admin status for ${selectedUser!.username}`,
          }),
        );
        onClose();
      })
      .catch(err => console.error(err.message))
      .finally(() => setLoading(false));
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Confirm{" "}
        {selectedUser?.is_admin
          ? `removal of "${selectedUser.username}" from admin`
          : `making "${selectedUser?.username}" admin`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          This action will{" "}
          {selectedUser?.is_admin ? (
            <>
              remove <i>{selectedUser.username}</i> from the admin list
            </>
          ) : (
            <>
              add <i>{selectedUser?.username}</i> to the admin list
            </>
          )}
          . Proceed?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton loading={loading} variant="contained" onClick={handleChangeAdmin}>
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmAdminDialog;
