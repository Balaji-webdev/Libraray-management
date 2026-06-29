import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./state-management/authSlice";
import profileReducer from './state-management/profileSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
  },
});

export default store;
