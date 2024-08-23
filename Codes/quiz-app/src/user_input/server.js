const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // To use environment variables

// Import models
const Quiz = require('./models/Quiz'); // Update the path to your Quiz model
const UserResponse = require('./models/UserResponse'); // Assuming you have a UserResponse model

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizApp';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes

// Fetch the latest quiz
app.get('/api/latest-quiz', async (req, res) => {
    try {
        const latestQuiz = await Quiz.findOne().sort({ createdAt: -1 });
        if (!latestQuiz) {
            return res.status(404).json({ message: 'No quiz found' });
        }
        res.json(latestQuiz);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching the latest quiz', error: error.message });
    }
});

// Submit user responses
app.post('/api/submit-responses', async (req, res) => {
    try {
        const { studentName, quizId, responses } = req.body;

        // Validate request
        if (!studentName || !quizId || !responses) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the quiz exists
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Create and save the user response
        const userResponse = new UserResponse({
            studentName,
            quiz: quizId,
            responses,
            completedAt: new Date(),
        });

        await userResponse.save();

        res.status(201).json({ message: 'Responses submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting responses', error: error.message });
    }
});

// Serve the frontend (make sure 'public/index.html' exists)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
