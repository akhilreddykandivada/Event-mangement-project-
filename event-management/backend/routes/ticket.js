const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');

// Buy ticket route
router.post('/buy', async (req, res) => {
  try {
    const { eventId, userId, name, email, phone, quantity = 1 } = req.body;
    const event = await Event.findById(eventId);
    const user = await User.findById(userId);
    if (!event || !user) return res.status(400).json({ error: 'Invalid user or event' });
    if (event.isCancelled) return res.status(400).json({ error: 'Event is cancelled' });
    if (event.eventType === 'college') {
      const existing = await Ticket.findOne({ eventId, userId });
      if (existing) return res.status(400).json({ error: 'Already purchased ticket for this college event' });
      if (quantity > 1) return res.status(400).json({ error: 'Only one ticket allowed for college events' });
    }
    if (event.ticketsAvailable < quantity) return res.status(400).json({ error: 'Not enough tickets available' });
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated payment
    event.ticketsAvailable -= quantity;
    await event.save();
    const ticket = new Ticket({ eventId, userId, name, email, phone, quantity });
    await ticket.save();
    res.status(201).json({ message: 'Ticket purchased', ticket, event });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get all tickets for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.params.userId }).populate('eventId');
    res.json(tickets);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get ticket details (for ticket details page)
router.get('/:ticketId', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId).populate('eventId');
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    res.json(ticket);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
