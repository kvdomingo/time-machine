import { useState } from "react";

import { Delete, Edit } from "@mui/icons-material";
import { Grid, IconButton, ListItem, Typography } from "@mui/material";
import moment from "moment/moment";
import pluralize from "pluralize";

import api from "@/api";

import { DEFAULT_TIME_FORMAT } from "@/utils/constants.ts";

import type { CheckInResponse } from "@/api/types/checkIn.ts";
import { useMutation } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import CheckInAddEdit from "./CheckInAddEdit";

interface CheckInItemProps {
  checkIn: CheckInResponse;
}

const Route = getRouteApi("/");

function CheckInItem({ checkIn }: CheckInItemProps) {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  const deleteCheckIn = useMutation({
    mutationFn: (id: string) => api.checkin.delete(id),
    mutationKey: ["checkin", "delete"],
  });

  const [isEditing, setIsEditing] = useState(false);

  async function handleDeleteCheckIn(id: string) {
    await deleteCheckIn.mutateAsync(id);
  }

  async function handleSelectTag(tag: string) {
    await navigate({
      to: "./",
      search: { ...search, tag: tag === search.tag ? undefined : tag },
    });
  }

  return (
    <ListItem>
      {isEditing ? (
        <CheckInAddEdit
          isEditing
          stopEditing={() => setIsEditing(false)}
          editingProps={checkIn}
        />
      ) : (
        <Grid container alignItems="center">
          <Grid item xs={12} md={1}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {moment(checkIn.record_date).format("MM/DD")}
            </Typography>
          </Grid>
          <Grid item xs md container alignItems="center">
            <Typography variant="body1">
              {checkIn.duration.toFixed(3)} {pluralize("hr", checkIn.duration)}
            </Typography>
            <Typography
              variant="body1"
              color="primary"
              className="mx-2 cursor-pointer"
              onClick={async () => await handleSelectTag(checkIn.tag)}
            >
              #{checkIn.tag}
            </Typography>
            <Typography variant="body1">{checkIn.activities}</Typography>
            <Typography variant="body1" ml={1}>
              ({moment(checkIn.start_time, "HH:mm:ss").format(DEFAULT_TIME_FORMAT)} -{" "}
              {moment(checkIn.start_time, "HH:mm:ss")
                .add(checkIn.duration, "hours")
                .format("HH:mm")}
              )
            </Typography>
          </Grid>
          <Grid item xs={2} md={2} container justifyContent={{ md: "flex-end" }}>
            <IconButton color="info" onClick={() => setIsEditing(true)} size="small">
              <Edit />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleDeleteCheckIn(checkIn.id)}
              size="small"
            >
              <Delete />
            </IconButton>
          </Grid>
        </Grid>
      )}
    </ListItem>
  );
}

export default CheckInItem;
