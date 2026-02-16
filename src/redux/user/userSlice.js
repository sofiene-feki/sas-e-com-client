// src/redux/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null, // Will store Firebase user object
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.userInfo = action.payload; // Firebase user
    },
    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    authLogout: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const { authStart, authSuccess, authFailure, authLogout } =
  userSlice.actions;

export default userSlice.reducer;
