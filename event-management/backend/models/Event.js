const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
  name: String,
  date: String,
  location: String,
  ticketsAvailable: Number,
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  eventType: { type: String, default: 'other' },
  cost: { type: String, default: 'Free' }, // New: cost per ticket or "Free"
  isCancelled: { type: Boolean, default: false } // Event cancellation flag
});
module.exports = mongoose.model('Event', EventSchema);
