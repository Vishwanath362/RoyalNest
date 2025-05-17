const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// POST /bookings - Add new booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
      