const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Add new event
router.post('/add', async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      creatorId: req.body.creatorId
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Cancel event
router.put('/cancel/:eventId', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.eventId,
      { isCancelled: true },
      { new: true }
    );
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get events created by user
router.get('/created-events/:userId', async (req, res) => {
  try {
    const events = await Event.find({ creatorId: req.params.userId });
    res.json(events);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Event listing by status, cancelled events included
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    let query = {};
    if (req.query.status === 'upcoming') {
      query = { date: { $gt: now.toISOString() } };
    } else if (req.query.status === 'completed') {
      query = { date: { $lt: now.toISOString() } };
    } else if (req.query.status === 'current') {
      const todayString = now.toISOString().slice(0, 10);
      query = { date: { $regex: `^${todayString}` } };
    }
    const events = await Event.find(query);
    res.json(events);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;
