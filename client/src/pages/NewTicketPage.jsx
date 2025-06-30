// client/src/pages/NewTicketPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; // Import your axios instance
import './NewTicketPage.css'; // Assuming you have some CSS for this page

function NewTicketPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send ticket data to backend
      const response = await api.post('/tickets', { title, message });
      const newTicket = response.data;
      alert('Ticket submitted successfully! AI has provided an initial response.');
      // Optionally, navigate to a page where the user can see their tickets
      navigate(`/tickets/my/${newTicket.id}`); // You might need to create this route later
                                               // For now, redirect to chatbot or home
      navigate('/');
    } catch (error) {
      console.error('Error submitting ticket:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to submit ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-ticket-page">
      <header className="ticket-header">
        <h1>Submit New Ticket</h1>
      </header>
      <main className="ticket-form-container">
        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="form-group">
            <label htmlFor="title">Ticket Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Account Login Issue"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              rows="6"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue in detail..."
              required
            ></textarea>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </form>
      </main>
    </div>
  );
}

export default NewTicketPage;