import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserProfile({ userId }) {
  const [createdEvents, setCreatedEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [view, setView] = useState('upcoming');

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const evRes = await axios.get(`/api/events/created-events/${userId}`);
        const tRes = await axios.get(`/api/tickets/user/${userId}`);
        setCreatedEvents(evRes.data);
        setTickets(tRes.data);
      } catch (err) {
        alert('Error fetching profile data: ' + err.message);
      }
    };

    fetchData();
  }, [userId]);

  const now = new Date();
  const filteredEvents = createdEvents.filter(event => {
    const eventDate = new Date(event.date);
    switch(view) {
      case 'upcoming': return eventDate > now;
      case 'current': return eventDate.toDateString() === now.toDateString();
      case 'completed': return eventDate < now;
      default: return true;
    }
  });

  // Calculate total tickets
  const totalTickets = tickets.reduce((acc, t) => acc + (t.quantity || 1), 0);

  if(!userId) return <div className="container">Please log in to view your profile.</div>;

  return (
    <div className="container">
      <h2>Your Profile</h2>
      <div>
        View:
        <button onClick={() => setView('upcoming')}>Upcoming</button>
        <button onClick={() => setView('current')}>Current</button>
        <button onClick={() => setView('completed')}>Completed</button>
      </div>
      <h3>Events You Created ({filteredEvents.length})</h3>
      <ul>
        {filteredEvents.map(event => (
          <li key={event._id}>
            {event.name} on {event.date} at {event.location} | Tickets Available: {event.ticketsAvailable}
            {event.isCancelled && <span style={{color:'#d00000', marginLeft:8}}>(Cancelled)</span>}
          </li>
        ))}
      </ul>
      <h3>Total Tickets Booked: {totalTickets}</h3>
    </div>
  );
}

export default UserProfile;
