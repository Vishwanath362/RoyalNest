const hotels = require('../models/hotels.json');

const renderIndex = (req, res) => {
  res.render('index', { title: 'RoyalNest', hotels, user: req.session.user });
};

const renderRegister = (req, res) => {
  res.render('register');
};

const renderAbout = (req, res) => {
  res.render('AboutUs');
};

const renderChristmas = (req, res) => {
  res.render('ChristmasOffer', { user: req.session.user });
};

const renderContact = (req, res) => {
  res.render('privacy');
};

const renderTerms = (req, res) => {
  res.render('terms');
};

const renderBeachfront = (req, res) => {
  res.render('Beachfront', { user: req.session.user });
};

const renderUrbanOasis = (req, res) => {
  res.render('UrbanOasis', { user: req.session.user });
};

const renderMountainEscape = (req, res) => {
  res.render('MountainEscape', { user: req.session.user });
};

const renderTheRitzLondon = (req, res) => {
  res.render('TheRitzLondon', { user: req.session.user });
};

const renderTheRitzBali = (req, res) => {
  res.render('TheRitzBali', { user: req.session.user });
};

const renderLogin = (req, res) => {
  const errorType = req.query.error;
  let errorMessage = '';

  if (errorType === 'nouser') {
    errorMessage = 'User not found. Please check your username or sign up.';
  } else if (errorType === 'wrongpassword') {
    errorMessage = 'Incorrect password. Please try again.';
  } else if (errorType === 'userexists') {
    errorMessage = 'Username already exists. Please choose a different username or login.';
  } else if (errorType === 'servererror') {
    errorMessage = 'An error occurred. Please try again later.';
  }

  res.render('login', { error: errorMessage });
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Could not log out.');
    }

    return res.redirect('/');
  });
};

module.exports = {
  renderIndex,
  renderRegister,
  renderAbout,
  renderChristmas,
  renderContact,
  renderTerms,
  renderBeachfront,
  renderUrbanOasis,
  renderMountainEscape,
  renderTheRitzLondon,
  renderTheRitzBali,
  renderLogin,
  logout
};
