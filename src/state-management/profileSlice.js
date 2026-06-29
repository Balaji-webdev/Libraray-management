
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserById, updateUser, changePassword as changePasswordApi } from "../service/UserService";

const initialState = {
  data: null, 
  status: "idle", 
  error: null,
  saving: false,
  saveError: null,
};

export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async (userId, { rejectWithValue }) => {
    try {
      const user = await getUserById(userId);
      const { password, ...safeUser } = user;
      return safeUser;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const saveProfile = createAsyncThunk(
  "profile/save",
  async ({ userId, changes }, { rejectWithValue }) => {
    try {
      const updated = await updateUser(userId, changes);
      const { password, ...safeUser } = updated;
      return safeUser;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "profile/updatePassword",
  async ({ userId, currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      await changePasswordApi(userId, currentPassword, newPassword);
      return true;
    } catch (err) {
      if (err.message === "CURRENT_PASSWORD_MISMATCH") {
        return rejectWithValue("Current password is incorrect.");
      }
      return rejectWithValue(err.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.data = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load profile.";
      })
      .addCase(saveProfile.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.data = action.payload;
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload || "Failed to save changes.";
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
