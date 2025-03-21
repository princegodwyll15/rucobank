const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { getAdminCollection } = require('../src/config'); // Import the function to get the admin collection

// Middleware to parse request bodies
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// GET request to render the signup page
router.get('/', (req, res) => {
    try {
        // Set headers to prevent caching of the signup page
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        res.set('Surrogate-Control', 'no-store');

        res.render('adminSignup', { alert: null }); // Render the signup page with no alert initially
    } catch (error) {
        console.error('Error rendering signup page:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST request to handle admin signup
router.post('/', async (req, res) => {
    try {
        const { username, email, employeeId, phone, password, confirmPassword } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).render('adminSignup', { alert: 'Passwords do not match!' });
        }

        // Get the admin collection
        const adminCollection = getAdminCollection();

        // Check if an admin with the same email or employeeId already exists
        const existingAdmin = await adminCollection.findOne({
            $or: [{ email }, { employeeId }]
        });

        if (existingAdmin) {
            // If admin already exists, render the signup page with an alert
            return res.status(400).render('adminSignup', { alert: 'Admin already exists!' });
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the admin details to the database
        await adminCollection.insertOne({
            username,
            email,
            employeeId,
            phone,
            password: hashedPassword,
            role: 'admin'
        });

        // Redirect to the admin dashboard after successful signup
        res.redirect('/admin');
    } catch (error) {
        console.error('Error during admin signup:', error);
        res.status(500).render('adminSignup', { alert: 'Internal Server Error' });
    }
});

module.exports = router;