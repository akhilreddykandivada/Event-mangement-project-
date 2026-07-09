import React, { useState } from 'react';
import axios from 'axios';

function AddEvent() {
  const [form, setForm] = useState({
    name: '', date: '', location: '', ticketsAvailable: '', eventType: 'college', customType: '', cost: ''
  });

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEventType = e => {
    setForm(prev => ({ ...prev, eventType: e.target.value, customType: '' }));
  };

  const submitEvent = async e => {
    e.preventDefault();
    let finalType = form.eventType === 'other' && form.customType ? form.customType : form.eventType;
    let cost = form.cost.trim().length === 0 ? "Free" : form.cost.trim();
    try {
      await axios.post('/api/events/add', {
        ...form,
        eventType: finalType,
        cost,
        creatorId: localStorage.getItem('userId')
      });
      alert('Event added!');
      setForm({ name: '', date: '', location: '', ticketsAvailable: '', eventType: 'college', customType: '', cost: '' });
    } catch (err) {
      alert('Failed to add event: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="container">
      <h2>Add New Event</h2>
      <form onSubmit={submitEvent}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Event Name" required />
        <input name="date" type="date" value={form.date} onChange={handleChange} required />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
        <input name="ticketsAvailable" type="number" value={form.ticketsAvailable} onChange={handleChange} placeholder="Tickets Available" required />
        <select name="eventType" value={form.eventType} onChange={handleEventType} required>
          <option value="college">College Event</option>
          <option value="other">Other</option>
        </select>
        {form.eventType === 'other' && (
          <input name="customType" placeholder="Enter event type" value={form.customType} onChange={handleChange} required />
        )}
        <input name="cost" value={form.cost} onChange={handleChange} placeholder="Ticket Cost (leave blank for Free)" />
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
}
export default AddEvent;
