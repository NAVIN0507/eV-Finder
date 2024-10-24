const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
  credentials: true, // Allow credentials (like cookies) to be sent
}));

app.use(express.json());

// Session setup (needed for Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key', // Replace with a secure secret
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // no need for these deprecated options
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

connectDB();

// Define Booking Schema (with email field)
const bookingSchema = new mongoose.Schema({
  name: String,
  staffId: String,
  email: String, 
  time: String, // For storing time
  date: String, // For storing date
  source: String,
  destination: String,
  reason: String,
  status: { type: String, default: 'Pending' },
});

const Booking = mongoose.model('Booking', bookingSchema);

// Passport Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
},
(accessToken, refreshToken, profile, done) => {
  // Extract the email from the Google profile
  const email = profile.emails[0].value; // Get email from Google

  // Now perform the domain check
  if (!email.endsWith('@bitsathy.ac.in')) {
    return done(null, false, { message: 'Unauthorized domain' });
  }

  // Proceed to find or create a user in the database
  const user = {
    name: profile.displayName,
    email: email, // Set the email for the user
  };
  console.log(user);
  done(null, user); // Pass user to serialization step
}));

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google OAuth route
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Google OAuth callback route
app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: 'http://localhost:3000/ ',
}), (req, res) => {
  // Successful authentication, redirect to your app's booking page.
  res.redirect('http://localhost:3000/book');
});

// Route to get authenticated user info
app.get('/auth/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Booking Routes
// app.post('/api/bookings', async (req, res) => {
//   try {
//     console.log(req.body);
//     console.log(req.user);
//     // Use the user's email from the session (provided by Google OAuth)
//     const booking = new Booking({ ...req.body});
//     console.log("BOoking",booking);
//     await booking.save();
//     res.status(201).json(booking);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });


app.post('/api/bookings', async (req, res) => {
  try {
    console.log(req.body); // Log to check the received data
    console.log(req.user); // Log to check user session data if needed
    
    // Create a new booking based on the received data
    const booking = new Booking({
      name: req.body.name,        // 'name' from frontend
      staffId: req.body.staffId,
      time:req.body.time,
      date:req.body.date,  // 'staffId' from frontend
      email: req.body.email,      // 'email' from frontend
      source: req.body.source,    // 'source' from frontend
      destination: req.body.destination, // 'destination' from frontend
      reason: req.body.reason     // 'reason' from frontend
    });

    await booking.save(); // Save the booking to the database
    res.status(201).json(booking); // Send success response
  } catch (error) {
    res.status(400).json({ error: error.message }); // Send error response
  }
});


app.get('/api/bookings', async (req, res) => {
  try {
    // Fetch bookings by the user's email
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
