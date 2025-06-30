// client/src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Get user from localStorage (if already logged in)
const user = JSON.parse(localStorage.getItem('user')); // Assuming you store user info in 'user' key

const initialState = {
  user: user ? user : null, // Set user from localStorage or null
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

const authSlice = createSlice({
  name: 'auth', // This is the name of your state slice
  initialState,
  reducers: {
    // Reducers are functions that define how the state changes
    // This is a basic example; you'd add more for login, logout, etc.
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    // You would typically add extraReducers for async actions like register/login
    // For now, we'll keep it simple to fix the store error.
  },
  // extraReducers: (builder) => {
  //   // You'd handle pending, fulfilled, rejected states for async thunks here
  // },
});

export const { reset } = authSlice.actions; // Export your actions
export default authSlice.reducer; // Export the reducer itself