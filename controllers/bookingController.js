const hotels = require('../models/hotels.json');
const { roomTypes } = require('../constants/booking');
const {
  getBookingsOrderedByCheckIn,
  hasBookingConflict,
  createBooking
} = require('../services/bookingService');

const bookingErrors = {
  room_unavailable: 'That room type is already booked for the selected dates. Please choose different dates or another room type.',
  invalid_dates: 'Check-out date must be greater than or equal to check-in date.',
  missing_fields: 'Please fill in all required booking details.'
};

const buildBookingPageData = async (req, { errorMessage = null, confirmationMessage = null } = {}) => {
  const userId = req.session.user && req.session.user.id;
  const year = new Date().getFullYear();
  const selectedHotel = req.query.hotel;
  const matchedHotel = hotels.find((hotel) => hotel.link === selectedHotel);
  const imgURL = matchedHotel ? matchedHotel.image : false;
  const bookings = await getBookingsOrderedByCheckIn(userId);

  return {
    title: 'Book a Room',
    activePage: 'book',
    hotels,
    roomTypes,
    year,
    selectedHotel,
    imgURL,
    bookings,
    errorMessage,
    confirmationMessage
  };
};

const renderBookingPage = async (req, res) => {
  const errorCode = req.query.error;
  const errorMessage = bookingErrors[errorCode] || null;

  try {
    const viewData = await buildBookingPageData(req, { errorMessage });
    return res.render('hotelbooking', viewData);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    return res.status(500).send('Internal Server Error');
  }
};

const submitBooking = async (req, res) => {
  const userId = req.session.user && req.session.user.id;
  const {
    hotelName,
    checkInDate,
    checkOutDate,
    roomType,
    fullName,
    email,
    phone,
    guests,
    specialRequests
  } = req.body;

  if (!hotelName || !roomType || !checkInDate || !checkOutDate) {
    return res.redirect('/book?error=missing_fields');
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime()) || checkOut < checkIn) {
    return res.redirect(`/book?hotel=${encodeURIComponent(hotelName)}&error=invalid_dates`);
  }

  try {
    const conflictExists = await hasBookingConflict({
      hotelName,
      roomType,
      checkInDate: checkIn,
      checkOutDate: checkOut
    });

    if (conflictExists) {
      return res.redirect(`/book?hotel=${encodeURIComponent(hotelName)}&error=room_unavailable`);
    }

    const newBooking = await createBooking({
      userId,
      hotelName,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      roomType,
      fullName,
      email,
      phone,
      guests,
      specialRequests
    });

    console.log('Booking saved:', newBooking._id);

    const viewData = await buildBookingPageData(req, {
      confirmationMessage: 'Booking confirmed successfully. Your reservation has been added below.'
    });

    return res.status(201).render('hotelbooking', viewData);
  } catch (error) {
    console.error('Error saving booking:', error);
    return res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  renderBookingPage,
  submitBooking
};
