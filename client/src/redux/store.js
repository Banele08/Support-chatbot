// client/src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'; // <-- ADD THIS LINE

export const store = configureStore({
  reducer: {
    auth: authReducer, // <-- ADD THIS LINE: Your 'auth' state slice will be managed by authReducer
    // You will add other reducers here as you create more slices (e.g., tickets, chat)
  },
});