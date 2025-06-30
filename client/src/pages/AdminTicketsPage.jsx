// client/src/pages/AdminTicketsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig'; // Import your axios instance
import './AdminTicketsPage.css';

function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/tickets'); // Fetch all tickets
        setTickets(response.data);
      } catch (err) {
        console.error('Error fetching tickets:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to fetch tickets.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    if (filterStatus === 'all') return true;
    return ticket.status === filterStatus;
  });

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-light)' }}>Loading tickets...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="admin-tickets-page">
      <header className="tickets-header">
        <h1>All Tickets</h1>
        <div className="status-filter">
          Filter by Status:
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </header>
      <main className="tickets-list-container">
        <div className="tickets-list">
          {filteredTickets.length > 0 ? (
            filteredTickets.map(ticket => (
              <Link to={`/admin/tickets/${ticket.id}`} key={ticket.id} className="ticket-card">
                <div className="ticket-info">
                  <h3>{ticket.title}</h3>
                  <p>User: {ticket.user_email}</p> {/* Use user_email from backend join */}
                  <p>Created: {new Date(ticket.created_at).toLocaleString()}</p>
                </div>
                <div className={`ticket-status ${ticket.status}`}>
                  {ticket.status.toUpperCase()}
                </div>
              </Link>
            ))
          ) : (
            <p>No tickets found for this status.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminTicketsPage;