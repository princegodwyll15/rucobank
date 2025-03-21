const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { getAdminCollection } = require('../src/config'); // Import the function to get the admin collection

// GET request to render the login page
router.get('/', (req, res) => {
    try {
        res.render('adminSignin', { alert: null }); // Pass 'alert' as null initially
    } catch (error) {
        console.error('Error rendering signin page:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST request to handle admin signin
router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log('Username provided:', username); // Debugging log

        // Ensure username and password are provided
        if (!username || !password) {
            return res.status(400).render('adminSignin', { alert: 'Username and password are required!' });
        }

        // Get the admin collection
        const adminCollection = getAdminCollection();

        // Debug: Log all users in the database
        const allUsers = await adminCollection.find({}).toArray();
        console.log('All users in database:', allUsers);

        // Find the user in the database (case-insensitive)
        const user = await adminCollection.findOne({ username: { $regex: `^${username}$`, $options: 'i' } });
        console.log('User found in database:', user); // Debugging log

        if (!user) {
            return res.status(404).render('adminSignin', { alert: 'Invalid username or password!' });
        }

        // Validate that the user has a password stored
        if (!user.password) {
            return res.status(400).render('adminSignin', { alert: 'Invalid username or password!' });
        }

        console.log('Stored hashed password:', user.password); // Debugging log

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match result:', isMatch); // Debugging log

        if (!isMatch) {
            return res.status(401).render('adminSignin', { alert: 'Invalid username or password!' });
        }

        // Redirect to the admin dashboard after successful signin
        res.redirect('/admin');
    } catch (error) {
        console.error('Error during admin signin:', error);
        res.status(500).render('adminSignin', { alert: 'Internal Server Error' });
    }
});

module.exports = router;