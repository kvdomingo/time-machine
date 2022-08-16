import { AlertColor } from "@mui/material";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserResponse } from "../api/types/auth";
import { CheckInResponse } from "../api/types/checkIn";
import { RootState } from "./store";

interface GlobalNotification {
  type: AlertColor;
  visible: boolean;
  message: string;
}

export interface TimeState {
  checkIns: CheckInResponse[];
  allCheckIns: CheckInResponse[];
  user: UserResponse | null;
  users: UserResponse[];
  loggedIn: boolean;
  apiRequestLoading: boolean;
  globalNotification: GlobalNotification;
}

export const initialState: TimeState = {
  checkIns: [],
  allCheckIns: [],
  user: null,
  users: [],
  loggedIn: false,
  apiRequestLoading: false,
  globalNotification: {
    type: "info",
    visible: false,
    message: "",
  },
};

export const timeSlice = createSlice({
  name: "time",
  initialState,
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
    updateUsers(state, action: PayloadAction<UserResponse[]>) {
      state.users = action.payload;
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
    resetTimeMachine(state) {
      state = { ...initialState };
    },
  },
});

export const {
  updateCheckIns,
  updateAllCheckIns,
  updateUsers,
  updateLoggedIn,
  updateApiRequestLoading,
  updateGlobalNotification,
  updateUser,
  resetTimeMachine,
} = timeSlice.actions;

export const selectCheckIns = (state: RootState) => state.time.checkIns;

export const selectAllCheckIns = (state: RootState) => state.time.allCheckIns;

export const selectUser = (state: RootState) => state.time.user;

export const selectUsers = (state: RootState) => state.time.users;

export const selectLoggedIn = (state: RootState) => state.time.loggedIn;

export const selectApiRequestLoading = (state: RootState) => state.time.apiRequestLoading;

export const selectGlobalNotification = (state: RootState) => state.time.globalNotification;

export default timeSlice.reducer;
