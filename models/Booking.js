const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    hotelName: String,
    checkInDate: Date,
    checkOutDate: Date,
    roomType: String,
    fullName: String,
    email: String,
    phone: String,
    guests: Number,
    specialRequests: String
});

module.exports = mongoose.model('Bookings', bookingSchema);
