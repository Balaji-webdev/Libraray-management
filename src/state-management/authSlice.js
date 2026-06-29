import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const storedUser = JSON.parse(localStorage.getItem("user"));
const storedAuth = JSON.parse(localStorage.getItem("auth"));

const initialState = {
  user: storedUser || null,
  auth: storedAuth || false,
  errors: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch("https://libraray-management-4ikn.onrender.com/user");
      if (!response.ok) {
        throw new Error("Server Error");
      }
      const users = await response.json();

      const user = users.find(
        (u) => u.email === email && u.password === password
      );
      if (!user) {
        return rejectWithValue("Invalid email or password");
      }

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("auth", JSON.stringify(true));

      return user;
    } catch (error) {
      return rejectWithValue("Server error. Please try again later.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signupSuccess: (state, action) => {
      state.user = {
        id: action.payload.id,
        username: action.payload.username,
        email: action.payload.email,
        role: action.payload.role,
      };
      state.auth = true;
      state.errors = null;

      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("auth", JSON.stringify(true));
    },

    logout: (state) => {
      state.user = null;
      state.auth = false;
      state.errors = null;
      
      localStorage.removeItem("user");
      localStorage.removeItem("auth");
    },
    syncIdentity: (state, action) => {
      if (!state.user) return;
      state.user = {
        ...state.user,
        ...action.payload, // e.g. { username, role }
      };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = {
          id: action.payload.id,
          username: action.payload.username,
          email: action.payload.email,
          role: action.payload.role,
        };
        state.auth = true;
        state.errors = null;
      })
      .addCase(loginUser.rejected, (state, action) => { 
        state.user = null;
        state.auth = false;
        state.errors =
          typeof action.payload === "string"
            ? action.payload
            : "An error occurred";
      });
  },
});

  export const { logout, signupSuccess,syncIdentity  } = authSlice.actions;
  export default authSlice.reducer;
