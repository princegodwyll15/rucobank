const express = require('express');
const router = express.Router();
const collection = require('../src/config');
const dotenv = require('dotenv');
dotenv.config();


router.get('/', (req, res) => {
    res.render('adminDashboard'); // Render the admin page
});


module.exports = router;