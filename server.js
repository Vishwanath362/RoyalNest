const express = require('express');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const apiRoutes = require('./api/apiRoutes');
const pageRoutes = require('./routes/pageRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { Logger } = require('./middlewares/logger');
const connectDb = require('./config/db');
const session = require('express-session');
dotenv.config(); // Load .env variables

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(Logger);
app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Routes
app.use('/api', apiRoutes);
app.use('/', pageRoutes);

// Global middlewares
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 8080;

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
