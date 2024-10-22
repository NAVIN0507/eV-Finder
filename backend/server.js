// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // For parsing application/json

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Use the environment variable MONGODB_URI
    const mongoURI = "mongodb://127.0.0.1:27017/"
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

// Define the Booking schema
const bookingSchema = new mongoose.Schema({
  name: String,
  staffId: String,
  source: String,
  destination: String,
  reason: String,
  status: { type: String, default: 'Pending' },
});

const Booking = mongoose.model('Booking', bookingSchema);

// Routes
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/bookings/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body; // Expect the new status to be sent in the body
  
      const updatedBooking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
      console.log('Received request to update booking with ID:', req.params.id);
      
      if (!updatedBooking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
  
      res.status(200).json(updatedBooking);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
