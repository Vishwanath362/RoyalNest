const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
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
