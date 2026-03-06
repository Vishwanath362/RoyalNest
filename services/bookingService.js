const Booking = require('../models/Booking');

const getBookingsOrderedByCheckIn = async (userId) => {
  return Booking.find({ userId }).sort({ checkInDate: 1 });
};

const hasBookingConflict = async ({ hotelName, roomType, checkInDate, checkOutDate }) => {
  return Booking.exists({
    hotelName,
    roomType,
    checkInDate: { $lt: checkOutDate },
    checkOutDate: { $gt: checkInDate }
  });
};

const createBooking = async (bookingData) => {
  const booking = new Booking(bookingData);
  return booking.save();
};

module.exports = {
  getBookingsOrderedByCheckIn,
  hasBookingConflict,
  createBooking
};
