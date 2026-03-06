const User = require('../models/userModel');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.redirect('/login?error=nouser');
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).send('Incorrect password');
    }

    req.session.user = {
      id: user._id,
      username: user.username
    };

    return res.redirect('/book');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
};

const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(401).json({ error: 'User already exists' });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    req.session.user = {
      id: newUser._id,
      username: newUser.username
    };

    return res.redirect('/');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  login,
  register
};
