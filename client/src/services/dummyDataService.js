let tickets = [
  {
    id: 't1',
    userId: 'u1',
    userEmail: 'user1@gmail.com',
    title: 'Cannot access my account',
    status: 'open',
    createdAt: '2025-06-05T10:00:00Z',
    messages: [
      { id: 'm1', sender: 'user', text: 'Hi, I cannot log in to my account. It says invalid credentials even though I\'m sure I entered the correct password.', timestamp: '2025-06-05T10:01:00Z' },
      { id: 'm2', sender: 'ai', text: 'Thank you for contacting Orange Book support. Please ensure your CAPS lock is off and try resetting your password. If the issue persists, please type "support" to connect with a human agent.', timestamp: '2025-06-05T10:02:00Z' },
    ]
  },
  {
    id: 't2',
    userId: 'u2',
    userEmail: 'user2@gmail.com',
    title: 'Feature Request: Dark Mode',
    status: 'closed',
    createdAt: '2025-06-01T15:30:00Z',
    messages: [
      { id: 'm3', sender: 'user', text: 'It would be great if Orange Book had a dark mode option. My eyes hurt looking at the bright screen at night.', timestamp: '2025-06-01T15:31:00Z' },
      { id: 'm4', sender: 'ai', text: 'We appreciate your feedback! Dark mode is a popular request, and we will consider it for future updates. Is there anything else I can help you with?', timestamp: '2025-06-01T15:32:00Z' },
      { id: 'm5', sender: 'admin', text: 'Thanks for the suggestion! We\'ve marked this as closed for now, but it\'s on our roadmap. [Admin: John Doe]', timestamp: '2025-06-01T16:00:00Z' },
    ]
  },
  {
    id: 't3',
    userId: 'u1',
    userEmail: 'user1@gmail.com',
    title: 'Billing question',
    status: 'pending',
    createdAt: '2025-06-07T09:00:00Z',
    messages: [
      { id: 'm6', sender: 'user', text: 'My last bill seems higher than usual. Can someone review my charges?', timestamp: '2025-06-07T09:01:00Z' },
      { id: 'm7', sender: 'ai', text: 'Our billing department can assist with this. Please provide your account ID. If you prefer to speak to a human, type "support".', timestamp: '2025-06-07T09:02:00Z' },
      { id: 'm8', sender: 'user', text: 'support', timestamp: '2025-06-07T09:05:00Z' },
      { id: 'm9', sender: 'ai', text: 'You\'ve requested human support. An admin will be notified and will review your ticket shortly.', timestamp: '2025-06-07T09:06:00Z' },
    ]
  },
];

const getTickets = () => {
  return [...tickets]; // Return a copy to prevent direct mutation
};

const getTicketById = (id) => {
  return tickets.find(ticket => ticket.id === id);
};

const addMessageToTicket = (ticketId, sender, text) => {
  const ticket = tickets.find(t => t.id === ticketId);
  if (ticket) {
    const newMessage = {
      id: `m${Date.now()}`, 
      sender,
      text,
      timestamp: new Date().toISOString()
    };
    ticket.messages.push(newMessage);
    
    if (sender === 'admin' && ticket.status === 'open') {
        ticket.status = 'pending'; 
    }
    return newMessage;
  }
  return null;
};

const updateTicketStatus = (ticketId, newStatus) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
        ticket.status = newStatus;
        return true;
    }
    return false;
};


export { getTickets, getTicketById, addMessageToTicket, updateTicketStatus };