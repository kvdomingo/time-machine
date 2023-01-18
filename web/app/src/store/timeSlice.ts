import { AlertColor } from "@mui/material";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash-es";
import moment from "moment";
import { CheckInResponse, TextLogResponse } from "../api/types/checkIn";
import { DEFAULT_DATE_FORMAT } from "../utils/constants";
import { RootState } from "./store";

interface GlobalNotification {
  type: AlertColor;
  visible: boolean;
  message: string;
}

export interface TimeState {
  checkIns: CheckInResponse[];
  count: number;
  startDate: string;
  endDate: string;
  tagCache: string[];
  textLog: TextLogResponse;
  apiRequestLoading: boolean;
  globalNotification: GlobalNotification;
}

export const initialState: TimeState = {
  checkIns: [],
  count: 0,
  startDate: moment().format(DEFAULT_DATE_FORMAT),
  endDate: moment().format(DEFAULT_DATE_FORMAT),
  tagCache: [],
  textLog: {},
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
    updateTagCache(state, action: PayloadAction<string[]>) {
      state.tagCache = action.payload;
    },
    updateCount(state, action: PayloadAction<number>) {
      state.count = action.payload;
    },
    updateStartDate(state, action: PayloadAction<string>) {
      state.startDate = action.payload;
    },
    updateEndDate(state, action: PayloadAction<string>) {
      state.endDate = action.payload;
    },
    updateTextLog(state, action: PayloadAction<TextLogResponse>) {
      state.textLog = action.payload;
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

export const {
  updateCheckIns,
  updateApiRequestLoading,
  updateGlobalNotification,
  updateTextLog,
  updateCount,
  updateTagCache,
  updateStartDate,
  updateEndDate,
} = timeSlice.actions;

export const selectCheckIns = (state: RootState) => state.time.checkIns;

export const selectCount = (state: RootState) => state.time.count;

export const selectStartDate = (state: RootState) => state.time.startDate;

export const selectEndDate = (state: RootState) => state.time.endDate;

export const selectTagCache = (state: RootState) => state.time.tagCache;

export const selectTextLog = (state: RootState) => state.time.textLog;

export const selectGlobalNotification = (state: RootState) => state.time.globalNotification;

export default timeSlice.reducer;
