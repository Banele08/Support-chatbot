// client/src/components/AdminPrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminPrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user'); // Get the user object string
  let user = null;

  if (userString) {
    try {
      user = JSON.parse(userString); // Parse it to a JavaScript object
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      // If parsing fails, treat as no user or invalid user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/login" replace />;
    }
  }

  // Check if a token exists AND if the parsed user object exists AND if their role is 'admin'
  if (token && user && user.role === 'admin') {
    return children ? children : <Outlet />; // Render children (AdminAppLayout) or Outlet
  } else if (token && user && user.role !== 'admin') {
    // If there's a token but the user is not an admin, redirect them to the non-admin home page
    return <Navigate to="/" replace />;
  } else {
    // If no token at all, redirect to login page
    return <Navigate to="/login" replace />;
  }
};

export default AdminPrivateRoute;