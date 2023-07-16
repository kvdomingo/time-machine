import { useEffect, useState } from "react";

import { Alert, Snackbar } from "@mui/material";

import { useDispatch, useSelector } from "@/store/hooks.ts";
import {
  selectGlobalNotification,
  updateGlobalNotification,
} from "@/store/timeSlice.ts";

function GlobalNotification() {
  const notificationState = useSelector(selectGlobalNotification);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(notificationState.visible);
  }, [notificationState]);

  function handleClose() {
    setOpen(false);
    setTimeout(
      () =>
        dispatch(
          updateGlobalNotification({
            message: "",
            type: "error",
            visible: false,
          }),
        ),
      300,
    );
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <Alert
        onClose={handleClose}
        severity={notificationState.type}
        sx={{ width: "100%" }}
      >
        {notificationState.message}
      </Alert>
    </Snackbar>
  );
}

export default GlobalNotification;
