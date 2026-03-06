const express = require('express');
const { checkIfLoggedIn } = require('../middlewares/auth');
const pageController = require('../controllers/pageController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get('/', pageController.renderIndex);
router.get('/register', pageController.renderRegister);
router.get('/about', pageController.renderAbout);
router.get('/christmas', pageController.renderChristmas);
router.get('/contact', pageController.renderContact);
router.get('/terms', pageController.renderTerms);
router.get('/Beachfront', pageController.renderBeachfront);
router.get('/UrbanOasis', pageController.renderUrbanOasis);
router.get('/MountainEscape', pageController.renderMountainEscape);
router.get('/TheRitzLondon', pageController.renderTheRitzLondon);
router.get('/TheRitzBali', pageController.renderTheRitzBali);
router.get('/login', pageController.renderLogin);
router.get('/logout', pageController.logout);

router.get('/book', checkIfLoggedIn, bookingController.renderBookingPage);
router.post('/book', checkIfLoggedIn, bookingController.submitBooking);

module.exports = router;
