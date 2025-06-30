// client/src/pages/AdminTicketDetailsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; // Import your axios instance
import './ChatbotPage.css'; // Reuse chat styling

function AdminTicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/tickets/${id}`);
      setTicket(response.data);
      setMessages(response.data.messages); // Messages are nested in the ticket object
    } catch (err) {
      console.error('Error fetching ticket details:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to fetch ticket details.');
      // If ticket not found or unauthorized, redirect back to tickets list
      if (err.response && (err.response.status === 404 || err.response.status === 403)) {
        navigate('/admin/tickets');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [id, navigate]); // Re-fetch if ID changes

  // Scroll to bottom of chat history on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageInput.trim() === '' || !ticket) return;

    try {
      // Send admin message to backend
      const response = await api.post(`/tickets/${ticket.id}/messages`, { content: messageInput.trim() });
      setMessages(response.data); // Backend returns updated messages
      setMessageInput(''); // Clear input

      // If admin replies, and ticket status is 'open', it's good practice to set it to 'pending'
      if (ticket.status === 'open') {
        await handleStatusChange({ target: { value: 'pending' } });
      }

    } catch (err) {
      console.error('Error sending message:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to send message.');
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await api.put(`/tickets/${ticket.id}/status`, { status: newStatus });
      setTicket(prevTicket => ({ ...prevTicket, status: newStatus })); // Update local state
      alert(`Ticket status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating status:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to update ticket status.');
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-light)' }}>Loading ticket details...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;
  }

  if (!ticket) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-light)' }}>Ticket not found.</div>;
  }

  return (
    <div className="chatbot-page">
      <header className="chatbot-header">
        <h1>Ticket: {ticket.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Status:</span>
          <select value={ticket.status} onChange={handleStatusChange} style={{
             backgroundColor: 'var(--input-bg)',
             color: 'var(--text-light)',
             border: '1px solid var(--border-color)',
             padding: '8px 12px',
             borderRadius: '5px',
             fontSize: '1em',
             cursor: 'pointer'
          }}>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </header>
      <main className="chat-container">
        <div className="chat-history">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.sender_type}`}> {/* Use sender_type */}
              <div className="message-content">
                {msg.content} {/* Use content */}
                <span style={{ display: 'block', fontSize: '0.75em', color: '#888', marginTop: '5px' }}>
                  {new Date(msg.created_at).toLocaleString()} {/* Use created_at */}
                </span>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form className="chat-input-area" onSubmit={handleSendMessage}>
          <textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Reply to user..."
            rows="1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          ></textarea>
          <button type="submit" className="send-button">
            Send Reply
          </button>
        </form>
      </main>
    </div>
  );
}

export default AdminTicketDetailsPage;