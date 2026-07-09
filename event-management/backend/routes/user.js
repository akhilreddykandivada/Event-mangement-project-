const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registration
router.post('/register', async (req, res) => {
  try {
    const existing = await User.findOne({
      $or: [{ email: req.body.email }, { phone: req.body.phone }]
    });
    if (existing) return res.status(400).json({ error: 'Email or phone already registered' });
    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = new User({ ...req.body, password: hashed });
    await user.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ error: 'Email not found' });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(401).json({ error: 'Incorrect password' });
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', userId: user._id, token });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get user detail
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Edit user account info
router.put('/:userId', async (req, res) => {
  try {
    const update = {};
    if (req.body.name) update.name = req.body.name;
    if (req.body.phone) update.phone = req.body.phone;
    const user = await User.findByIdAndUpdate(req.params.userId, update, { new: true, select: '-password' });
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
