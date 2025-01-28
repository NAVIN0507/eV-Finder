const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google OAuth route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}` }), (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/book`);
});

// Route to get authenticated user info
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.redirect(`${process.env.FRONTEND_URL}`);
  }
});

module.exports = router;
