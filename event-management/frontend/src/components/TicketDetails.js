import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function TicketDetails() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await axios.get(`/api/tickets/${ticketId}`);
        setTicket(res.data);
      } catch (err) {
        setTicket(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [ticketId]);

  if (loading) return <div className="container">Loading ticket...</div>;
  if (!ticket) return <div className="container">Ticket not found.</div>;

  return (
    <div className="container">
      <h2>Ticket Details</h2>
      <b>Event:</b> {ticket.eventId.name}<br/>
      <b>Event Type:</b> {ticket.eventId.eventType}<br/>
      <b>Date:</b> {ticket.eventId.date}<br/>
      <b>Location:</b> {ticket.eventId.location}<br/>
      <b>Cost:</b> {ticket.eventId.cost}<br/>
      <b>Ticket Holder Name:</b> {ticket.name}<br/>
      <b>Email:</b> {ticket.email}<br/>
      <b>Phone:</b> {ticket.phone}<br/>
      <b>No. of Tickets:</b> {ticket.quantity}<br/>
      <b>Purchase Time:</b> {new Date(ticket.purchaseDate).toLocaleString()}<br/>
      {ticket.eventId.isCancelled &&
        <span style={{color:'#d00000', fontWeight:"bold"}}>This event was CANCELLED</span>
      }
    </div>
  );
}

export default TicketDetails;
