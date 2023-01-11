import { AlertColor } from "@mui/material";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash-es";
import { CheckInResponse } from "../api/types/checkIn";
import { RootState } from "./store";

interface GlobalNotification {
  type: AlertColor;
  visible: boolean;
  message: string;
}

export interface TimeState {
  checkIns: CheckInResponse[];
  apiRequestLoading: boolean;
  globalNotification: GlobalNotification;
}

export const initialState: TimeState = {
  checkIns: [],
  apiRequestLoading: false,
  globalNotification: {
    type: "info",
    visible: false,
    message: "",
  },
};

export const timeSlice = createSlice({
  name: "time",
  initialState: cloneDeep(initialState),
  reducers: {
    updateCheckIns(state, action: PayloadAction<CheckInResponse[]>) {
      state.checkIns = action.payload;
    },
    updateApiRequestLoading(state, action: PayloadAction<boolean>) {
      state.apiRequestLoading = action.payload;
    },
    updateGlobalNotification(state, action: PayloadAction<GlobalNotification>) {
      state.globalNotification = action.payload;
    },
    resetTimeMachine(state) {
      Object.assign(state, cloneDeep(initialState));
    },
  },
});

export const { updateCheckIns, updateApiRequestLoading, updateGlobalNotification } = timeSlice.actions;

export const selectCheckIns = (state: RootState) => state.time.checkIns;

export const selectGlobalNotification = (state: RootState) => state.time.globalNotification;

export default timeSlice.reducer;
