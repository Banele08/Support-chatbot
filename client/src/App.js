// client/src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // useNavigate is not needed directly in App

// Import all pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatbotPage from "./pages/ChatbotPage"; // Note: Ensure this is from /pages, not /components if you moved it
import NewTicketPage from "./pages/NewTicketPage";
import AdminTicketsPage from './pages/AdminTicketsPage';
import AdminTicketDetailsPage from './pages/AdminTicketDetailsPage';

// Import all components
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from './components/AdminPrivateRoute';
import Sidebar from "./components/Sidebar";

const App = () => {
  return (
    <Router> {/* Router wraps the entire application content */}
      <div style={{ display: 'flex', minHeight: '100vh' }}> {/* Flex container for sidebar and main content */}
        <Routes>
          {/* Public Routes - Accessible without login */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* User Protected Routes - Accessible only by authenticated regular users */}
          {/* This route catches any path not matched by public routes AND is protected by PrivateRoute */}
          <Route
            path="/*" // Catches all paths for authenticated users (default user view)
            element={
              <PrivateRoute>
                <UserAppLayout />
              </PrivateRoute>
            }
          />

          {/* Admin Protected Routes - Accessible only by authenticated admin users */}
          {/* This specific route pattern ensures only '/admin/*' paths are handled by AdminPrivateRoute */}
          <Route
            path="/admin/*" // Catches all paths starting with /admin for authenticated admins
            element={
              <AdminPrivateRoute>
                <AdminAppLayout />
              </AdminPrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

// Layout for regular users: includes Sidebar and specific user routes
const UserAppLayout = () => {
  return (
    <>
      <Sidebar /> {/* Sidebar visible for user layout */}
      <div style={{ flexGrow: 1, paddingLeft: '20px', paddingRight: '20px' }}> {/* Main content area */}
        <Routes>
          <Route path="/" element={<ChatbotPage />} /> {/* Default user landing page */}
          <Route path="/new-chat" element={<ChatbotPage />} />
         
          <Route path="/new-ticket" element={<NewTicketPage />} /> {/* User's new ticket submission */}
          {/* Add other user-specific protected routes here (e.g., /my-tickets) */}
        </Routes>
      </div>
    </>
  );
};

// Layout for admin users: includes Sidebar and specific admin routes
const AdminAppLayout = () => {
  return (
    <>
      <Sidebar /> {/* Sidebar visible for admin layout */}
      <div style={{ flexGrow: 1, paddingLeft: '20px', paddingRight: '20px' }}> {/* Main content area */}
        <Routes>
          <Route path="tickets" element={<AdminTicketsPage />} /> {/* Admin's list of tickets */}
          <Route path="tickets/:id" element={<AdminTicketDetailsPage />} /> {/* Admin's ticket details view */}
          <Route path="/" element={<AdminTicketsPage />} /> {/* Default admin landing page is tickets list */}
          {/* Add other admin-specific routes here (e.g., /admin/users, /admin/stats) */}
        </Routes>
      </div>
    </>
  );
};

export default App;