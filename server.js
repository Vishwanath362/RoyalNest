const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const apiRoutes = require('./api/apiRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { Logger } = require('./middlewares/logger');
const hotels = require('./models/hotels.json');
const Booking = require('./models/Booking'); // Booking model
const {checkIfLoggedIn} = require('./middlewares/auth')
const session = require('express-session');
dotenv.config(); // Load .env variables

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'blindhope32',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));
// Routes
app.use('/api', apiRoutes);

// Pages
// app.get('/', (req, res) => {
//     res.render('login');
// });

app.get('/', (req, res) => {
    res.render('index', { title: "RoyalNest", hotels , user: req.session.user});
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/about', (req, res) => {
    res.render('AboutUs');
});

app.get('/christmas', (req, res) => {
    res.render('ChristmasOffer');
});

app.get('/contact', (req, res) => {
    res.render('privacy');
});

app.get('/terms', (req, res) => {
    res.render('terms');
});

app.get('/Beachfront', (req, res) => {
    res.render('Beachfront',{user: req.session.user});
});

app.get('/UrbanOasis', (req, res) => {
    res.render('UrbanOasis',{user: req.session.user});
});

app.get('/MountainEscape', (req, res) => {
    res.render('MountainEscape',{user: req.session.user});
});

app.get('/TheRitzLondon', (req, res) => {
    res.render('TheRitzLondon',{user: req.session.user});
});

app.get('/TheRitzBali', (req, res) => {
    res.render('TheRitzBali',{user: req.session.user});
});

app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Logout Error:", err);
      return res.status(500).send("Could not log out.");
    }
    res.redirect('/'); 
  });
});

// Booking Page
const roomTypes = [
    { value: "single", name: "Single" },
    { value: "double", name: "Double" },
    { value: "suite", name: "Suite" },
    { value: "deluxe", name: "Deluxe" }
];

app.get('/book',checkIfLoggedIn, async (req, res) => {
  const year = new Date().getFullYear();
  const selectedHotel = req.query.hotel;
  const matchedHotel = hotels.find(hotel => hotel.link === selectedHotel);
  const imgURL = matchedHotel ? matchedHotel.image : false;

  try {
    const bookings = await Booking.find().sort({ checkInDate: 1 }); // Fetch all bookings

    res.render('hotelbooking', {
      title: "Book a Room",
      activePage: "book",
      hotels,
      roomTypes,
      year,
      selectedHotel,
      imgURL,
      bookings // send bookings to EJS
    });
  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
    res.status(500).send("Internal Server Error");
  }
});


// Handle Booking Form Submission & Save to MongoDB
app.post('/book', async (req, res) => {
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

    try {
        const newBooking = new Booking({
            hotelName,
            checkInDate,
            checkOutDate,
            roomType,
            fullName,
            email,
            phone,
            guests,
            specialRequests
        });

        await newBooking.save();
        console.log("✅ Booking saved:", newBooking);
        res.redirect('/');
    } catch (error) {
        console.error("❌ Error saving booking:", error);
        res.status(500).send("Internal Server Error");
    }
});


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ MongoDB connected successfully');
})
.catch((err) => {
    console.error('❌ MongoDB connection error:', err);
});

// Global middlewares
app.use(Logger);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
