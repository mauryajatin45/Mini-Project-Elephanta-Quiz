const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); // For password hashing
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection URI
const uri = 'mongodb+srv://mauryajatin45:laxmi%23120224@cluster0.w6n0w.mongodb.net/userDB?retryWrites=true&w=majority';

// MongoDB connection
mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: String,
    surname: String,
    mobile: String,
    email: String,
    dob: Date,
    location: String,
});

const User = mongoose.model('User', userSchema);

// Sign Up Route
app.post('/signup', async (req, res) => {
    const { username, password, name, surname, mobile, email, dob, location } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, name, surname, mobile, email, dob, location });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // Compare the password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error('Error in /login:', error);
        res.status(500).json({ message: "Error logging in" });
    }
});

// Google Login Route
app.post('/google-login', async (req, res) => {
    const { username, email, name } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            const newUser = new User({ username, email, name });
            await newUser.save();
            return res.status(201).json({ message: "User registered successfully" });
        }
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error('Error in /google-login:', error);
        res.status(500).json({ message: "Error logging in" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
