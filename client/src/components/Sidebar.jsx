import React, { useEffect, useState } from 'react';
import { Link, useNavigate,useLocation } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
   setIsAdmin(token && token.startsWith('adm.'));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token
    navigate('/login'); // Redirect to login page
  };
  const isActive = (path) => {
    return location.pathname === path || (location.pathname === '/' && path === '/');
  };

    return (
    <div style={{
      width: '250px',
      backgroundColor: '#222', 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      boxShadow: '2px 0 5px rgba(0, 0, 0, 0.3)',
      borderRight: '1px solid var(--border-color)'
    }}>
      <h2 style={{ color: 'var(--secondary-orange)', marginBottom: '30px', textAlign: 'center', width: '100%' }}>Orange Book</h2>
      <nav style={{ width: '100%', flexGrow: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '15px' }}>
            <Link to="/new-chat" style={{
              color: 'var(--text-light)',
              textDecoration: 'none',
              fontSize: '1.1em',
              display: 'block',
              padding: '10px',
              borderRadius: '5px',
              transition: 'background-color 0.2s ease',
              backgroundColor: window.location.pathname === '/new-chat' || window.location.pathname === '/' ? 'rgba(255, 140, 0, 0.2)' : 'transparent' 
            }}>
              New Chat
            </Link>
          </li>
          
        </ul>
      </nav>
      <button onClick={handleLogout} style={{ width: '100%', marginTop: 'auto' }}>
        Logout
      </button>
    </div>
  );
}

export default Sidebar;