const express = require('express');
const router = express.Router();
const {
  hasBookingConflict,
  createBooking
} = require('../services/bookingService');

// POST /bookings - Add new booking
router.post('/', async (req, res) => {
  const {
    hotelName,
    roomType,
    checkInDate,
    checkOutDate
  } = req.body;

  if (!hotelName || !roomType || !checkInDate || !checkOutDate) {
    return res.status(400).json({ error: 'hotelName, roomType, checkInDate and checkOutDate are required.' });
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime()) || checkOut < checkIn) {
    return res.status(400).json({ error: 'Invalid booking dates. checkOutDate must be greater than or equal to checkInDate.' });
  }

  try {
    const conflictExists = await hasBookingConflict({
      hotelName,
      roomType,
      checkInDate: checkIn,
      checkOutDate: checkOut
    });

    if (conflictExists) {
      return res.status(409).json({
        error: 'Room is already booked for the selected dates.'
      });
    }

    const savedBooking = await createBooking({
      ...req.body,
      checkInDate: checkIn,
      checkOutDate: checkOut
    });

    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
      