import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import Typography from '@mui/material/Typography';

function BuyTicket({ userId }) {
  const { eventId } = useParams();
  const [form, setForm] = useState({ name: '', email: '', phone: '', quantity: 1 });
  const [confirmed, setConfirmed] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const buyTicket = async () => {
    if (!form.name || !form.email || !form.phone) {
      alert('Please fill all fields');
      return;
    }
    if (form.quantity < 1) {
      alert('Quantity must be at least 1');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/api/tickets/buy', { eventId, userId, ...form });
      setTicket(res.data.ticket);
      setEvent(res.data.event);
      setConfirmed(true);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
    setLoading(false);
  };

  if (confirmed && ticket && event) {
    const qrUrl = `http://192.168.0.107:3000/ticket/${ticket._id}`;// QR links directly to ticket details
    return (
      <div className="container">
        <h2>Ticket Confirmed</h2>
        <QRCodeCanvas value={qrUrl} size={200} />  
        <div style={{marginTop: 16}}>
          <b>Event:</b> {event.name}<br/>
          <b>Date:</b> {event.date}<br/>
          <b>Location:</b> {event.location}<br/>
          <b>Cost:</b> {event.cost}<br/>
          <b>Ticket Holder Name:</b> {form.name}<br/>
          <b>Email:</b> {form.email}<br/>
          <b>Phone:</b> {form.phone}<br/>
          <b>Tickets Bought:</b> {ticket.quantity}
        </div>
        <Typography variant="body2" sx={{mt:2}}>
          Scan this QR to view this ticket and details online, including ticket holder info.
        </Typography>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Buy Ticket</h2>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" />
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" />
      <input 
        name="quantity" 
        type="number" 
        value={form.quantity} 
        min="1"
        onChange={handleChange} 
        placeholder="Quantity" 
      />
      <button onClick={buyTicket} disabled={loading}>
        {loading ? 'Processing payment...' : 'Confirm Buy'}
      </button>
    </div>
  );
}
export default BuyTicket;
