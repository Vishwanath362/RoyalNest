const express = require('express');
const router = express.Router();
const User = require('../models/userModel');  // Import the User model

// POST login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).send('User not found');
        }

        // Compare entered password with stored password
        const isMatch = await user.matchPassword(password);
        if (isMatch) {
            // Successful login
                     req.session.user = {
                id: user._id,
                username: user.username,
                // add other info if needed
            };

            return res.redirect('/book');
        } else {
            // Incorrect password
            return res.status(401).send('Incorrect password');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
});

// POST register route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(401).json({ error: 'User already exists' });
    }

    // Create and save new user
    const newUser = new User({ username, password });
    await newUser.save();

    //  Set session after saving
    req.session.user = {
      id: newUser._id,
      username: newUser.username
    };

    // Redirect after successful registration
    return res.redirect('/');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
