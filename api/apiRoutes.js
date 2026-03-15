const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const hotels = require('../models/hotels.json');
const {
    countOverlappingBookings,
    deallocateExpiredBookings
} = require('../services/bookingService');


router.post('/login', authController.login);


router.post('/register', authController.register);


router.get('/availability', async (req, res) => {
    const { hotel, checkIn, checkOut } = req.query;
    if (!hotel || !checkIn || !checkOut) {
        return res.status(400).json({ error: 'hotel, checkIn and checkOut are required.' });
    }
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime()) || checkOutDate < checkInDate) {
        return res.status(400).json({ error: 'Invalid dates.' });
    }
    const matchedHotel = hotels.find(h => h.name === hotel);
    if (!matchedHotel || !matchedHotel.rooms) {
        return res.status(404).json({ error: 'Hotel not found.' });
    }
    try {
        await deallocateExpiredBookings();
        const availability = {};
        await Promise.all(
            Object.entries(matchedHotel.rooms).map(async ([roomType, capacity]) => {
                const booked = await countOverlappingBookings({ hotelName: hotel, roomType, checkInDate, checkOutDate });
                availability[roomType] = Math.max(0, capacity - booked);
            })
        );
        res.json(availability);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch availability.' });
    }
});


module.exports = router;
