// import { createSlice } from "@reduxjs/toolkit";

// const userSlice = createSlice({
//   name: "user",
//   initialState: null,
//   reducers: {
//     addUser: (state, action) => {
//       return action.payload;
//     },
//     removeUser: (state, action) => {
//       return null;
//     },
//   },
// });

// export const { addUser, removeUser } = userSlice.actions;

// export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage when app starts
const storedUser = localStorage.getItem("user");
const initialState = storedUser ? JSON.parse(storedUser) : null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      localStorage.setItem("user", JSON.stringify(action.payload)); // Save user to localStorage
      return action.payload;
    },
    removeUser: (state) => {
      localStorage.removeItem("user"); // Remove user from localStorage
      return null;
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
