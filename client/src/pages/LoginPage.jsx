// client/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/users/login', { email, password });
      const { token, role, ...userData } = response.data; // Destructure role and other user data

      console.log('Login successful! Received token:', token);
      console.log('Received role:', role);

      // Store the token and the user object (which includes the role) in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ ...userData, role })); // <--- ADD THIS LINE to store role persistently

      alert('Login successful!');

      if (role === 'admin') {
        navigate('/admin/tickets'); // Redirect admin to admin page
      } else {
        navigate('/'); // Redirect user to chatbot page (or /dashboard)
      }

    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
}

export default LoginPage;