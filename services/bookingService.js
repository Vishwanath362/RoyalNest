const Booking = require('../models/Booking');

const getBookingsOrderedByCheckIn = async (userId) => {
  return Booking.find({ userId }).sort({ checkInDate: 1 });
};

const countOverlappingBookings = async ({ hotelName, roomType, checkInDate, checkOutDate }) => {
  return Booking.countDocuments({
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

const deallocateExpiredBookings = async () => {
  return Booking.deleteMany({ checkOutDate: { $lt: new Date() } });
};

module.exports = {
  getBookingsOrderedByCheckIn,
  countOverlappingBookings,
  createBooking,
  deallocateExpiredBookings
};
