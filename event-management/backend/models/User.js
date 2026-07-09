const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: { type: String, required: true }
});
module.exports = mongoose.model('User', UserSchema);
