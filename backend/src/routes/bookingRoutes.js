const express = require('express');
const Booking = require('../models/Booking');
const router = express.Router();

// Create a booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all bookings or filter by date
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const bookings = date ? await Booking.find({ date }) : await Booking.find({});
    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get bookings by email (history)
router.post('/history', async (req, res) => {
  try {
    const { fmail } = req.body;
    if (!fmail) return res.status(400).json({ error: 'Email is required' });
    const bookings = await Booking.find({ email: fmail });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update booking status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedBooking) return res.status(404).json({ error: 'Booking not found' });
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
