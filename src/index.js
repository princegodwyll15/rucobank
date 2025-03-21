const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); // Correctly configure dotenv
const adminsigninRoute = require('../routes/adminsigninRoute');
const adminsignupRoute = require('../routes/adminsignupRoute');
const adminpageRoute = require('../routes/adminpageRoute');
const path = require('path');
const app = express();

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use(express.json()); // For parsing JSON data

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../public')));
// Middleware to parse JSON bodies
app.use(express.json());

// Mount routes
app.use('/', adminsigninRoute); // Sign-in routes
app.use('/signin', adminsigninRoute); // Additional sign-in routes
app.use('/signup', adminsignupRoute); // Sign-up routes
app.use('/admin', adminpageRoute); // Admin page routes

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is listening at ${port}`);
});