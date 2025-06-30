// client/src/pages/ChatbotPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axiosConfig'; // Import axios instance
import './ChatbotPage.css'; // Your existing CSS

function ChatbotPage() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! How can I help you today?', id: 'initial' },
  ]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageInput.trim() === '') return;

    const userMessage = messageInput.trim();
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: userMessage, id: Date.now() + '_user' },
    ]);
    setMessageInput('');
    setLoading(true);

    try {
      // THIS ENDPOINT NEEDS TO BE CREATED IN YOUR BACKEND
      // Example: POST /api/chat/message (This would directly call aiController.getAiResponse)
      const response = await api.post('/chat/message', { userMessage });
      const aiResponseText = response.data.aiResponse; // Assuming backend sends { aiResponse: "..." }

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: aiResponseText, id: Date.now() + '_ai' },
      ]);
    } catch (error) {
      console.error('Error getting AI response:', error.response?.data || error.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: 'I apologize, but I am having trouble connecting right now. Please try again later.', id: Date.now() + '_error' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSupportRequest = async () => {
    const supportMessage = "I need human support.";
    setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', text: supportMessage, id: Date.now() + '_user_support' },
    ]);
    setLoading(true);

    try {
        // This would initiate a new ticket creation for human support
        // Or send a special message to an existing ticket to escalate.
        // For simplicity, let's assume it creates a new ticket.
        const response = await api.post('/tickets', {
            title: "Support Request from Chatbot",
            message: supportMessage
        });
        const newTicket = response.data;
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'ai', text: `Okay, I've created a ticket for human support (ID: ${newTicket.id}). An agent will contact you shortly.`, id: Date.now() + '_ai_ticket' },
        ]);
        alert(`Ticket ${newTicket.id} created for human support.`);
        // Optionally, redirect to the ticket details page for the user if you implement one
        // navigate(`/tickets/my/${newTicket.id}`);
    } catch (error) {
        console.error('Error escalating to support:', error.response?.data || error.message);
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'ai', text: 'I apologize, but I am unable to create a support ticket at this moment. Please try again later.', id: Date.now() + '_error_support' },
        ]);
    } finally {
        setLoading(false);
    }
  };


  return (
    <div className="chatbot-page">
      <header className="chatbot-header">
        <h1>Orange Book AI Assistant</h1>
      </header>
      <main className="chat-container">
        <div className="chat-history">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              <div className="message-content">
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-message ai loading-indicator">
              <div className="message-content">...</div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <form className="chat-input-area" onSubmit={handleSendMessage}>
          <textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            rows="1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          ></textarea>
          <button type="submit" className="send-button" disabled={loading}>
            Send
          </button>
          <button type="button" onClick={handleSupportRequest} className="support-button" disabled={loading}>
            Support
          </button>
        </form>
      </main>
    </div>
  );
}

export default ChatbotPage;