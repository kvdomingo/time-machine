import { AlertColor } from "@mui/material";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash-es";
import moment from "moment/moment";
import { UserResponse } from "../api/types/auth";
import { CheckInResponse } from "../api/types/checkIn";
import { RootState } from "./store";

interface GlobalNotification {
  type: AlertColor;
  visible: boolean;
  message: string;
}

interface AdminFilters {
  users: string[];
  tags: string[];
  startDate: number;
  endDate: number;
}

export interface TimeState {
  checkIns: CheckInResponse[];
  allCheckIns: CheckInResponse[];
  user: UserResponse | null;
  allUsers: UserResponse[];
  loggedIn: boolean;
  apiRequestLoading: boolean;
  globalNotification: GlobalNotification;
  adminViewFilters: AdminFilters;
}

export const initialState: TimeState = {
  checkIns: [],
  allCheckIns: [],
  user: null,
  allUsers: [],
  loggedIn: false,
  apiRequestLoading: false,
  globalNotification: {
    type: "info",
    visible: false,
    message: "",
  },
  adminViewFilters: {
    startDate: moment().startOf("isoWeek").valueOf(),
    endDate: moment().endOf("day").valueOf(),
    tags: [],
    users: [],
  },
};

export const timeSlice = createSlice({
  name: "time",
  initialState: cloneDeep(initialState),
  reducers: {
    updateCheckIns(state, action: PayloadAction<CheckInResponse[]>) {
      state.checkIns = action.payload;
    },
    updateAllCheckIns(state, action: PayloadAction<CheckInResponse[]>) {
      state.allCheckIns = action.payload;
    },
    updateUser(state, action: PayloadAction<UserResponse | null>) {
      state.user = action.payload;
    },
    updateAllUsers(state, action: PayloadAction<UserResponse[]>) {
      state.allUsers = action.payload;
    },
    updateLoggedIn(state, action: PayloadAction<boolean>) {
      state.loggedIn = action.payload;
    },
    updateApiRequestLoading(state, action: PayloadAction<boolean>) {
      state.apiRequestLoading = action.payload;
    },
    updateGlobalNotification(state, action: PayloadAction<GlobalNotification>) {
      state.globalNotification = action.payload;
    },
    updateAdminViewFilters(state, action: PayloadAction<AdminFilters>) {
      state.adminViewFilters = action.payload;
    },
    resetTimeMachine(state) {
      Object.assign(state, cloneDeep(initialState));
    },
  },
});

export const {
  updateCheckIns,
  updateAllCheckIns,
  updateLoggedIn,
  updateApiRequestLoading,
  updateGlobalNotification,
  updateUser,
  updateAllUsers,
  updateAdminViewFilters,
  resetTimeMachine,
} = timeSlice.actions;

export const selectCheckIns = (state: RootState) => state.time.checkIns;

export const selectAllCheckIns = (state: RootState) => state.time.allCheckIns;

export const selectUser = (state: RootState) => state.time.user;

export const selectAllUsers = (state: RootState) => state.time.allUsers;

export const selectLoggedIn = (state: RootState) => state.time.loggedIn;

export const selectApiRequestLoading = (state: RootState) => state.time.apiRequestLoading;

export const selectGlobalNotification = (state: RootState) => state.time.globalNotification;

export const selectAdminViewFilters = (state: RootState) => state.time.adminViewFilters;

export default timeSlice.reducer;
