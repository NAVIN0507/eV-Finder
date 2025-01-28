const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: String,
  staffId: String,
  email: String,
  time: String,
  date: String,
  source: String,
  destination: String,
  reason: String,
  status: { type: String, default: 'Pending' },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
