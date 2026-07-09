const mongoose = require('mongoose');
const TicketSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  email: String,
  phone: String,
  quantity: Number,
  purchaseDate: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Ticket', TicketSchema);
