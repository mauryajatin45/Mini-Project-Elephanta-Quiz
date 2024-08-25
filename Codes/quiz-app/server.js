// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const Quiz = require('./models/quiz');
// const UserResponse = require('user_input\models\UserResponse.js'); // Import your UserResponse model


const app = express();
const PORT = process.env.PORT || 3000;

// Apply CORS middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname, 'src')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/quizApp', {

    serverSelectionTimeoutMS: 30000
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Route to submit a new quiz
app.post('/submit-quiz', async (req, res) => {
    const { quizName, scheduleDate, timeLimit, questions } = req.body;

    try {
        const newQuiz = new Quiz({
            name: quizName,
            scheduleDate,
            timeLimit,
            questions
        });

        await newQuiz.save();
        res.status(201).send('Quiz successfully created!');
    } catch (error) {
        res.status(400).send('Error creating quiz: ' + error.message);
    }
});

// Route to get the count of quizzes
app.get('/quiz-count', async (req, res) => {
    console.log('Received request for quiz count');
    try {
        const count = await Quiz.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).send('Error fetching quiz count: ' + error.message);
    }
});


// Route to fetch all quizzes with names, creation dates, scheduleDate, and timeLimit
app.get('/quizzes', async (req, res) => {
    try {
        const quizzes = await Quiz.find({}, 'name createdAt scheduleDate timeLimit');
        res.json(quizzes);
    } catch (error) {
        res.status(500).send('Error fetching quizzes: ' + error.message);
    }
});

// Route to fetch quiz details by ID including scheduleDate and timeLimit
app.get('/quiz/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).send('Quiz not found');
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).send('Error fetching quiz details: ' + error.message);
    }
});


// Catch-all route to serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


app.get('/debug', (req, res) => {
    res.json({ message: 'Debug route hit successfully' });
});

app.get('/total-responses', async (req, res) => {
    try {
        const totalResponses = await UserResponse.aggregate([
            { $unwind: "$responses" }, // Unwind responses array to get each response separately
            { $count: "total" }         // Count the total number of responses
        ]);

        const count = totalResponses.length > 0 ? totalResponses[0].total : 0;
        console.log('Total responses count:', count); // For debugging

        res.json({ count }); // Respond with the count as JSON
    } catch (error) {
        console.error('Error fetching total responses:', error);
        res.status(500).json({ error: 'Error fetching total responses' }); // Return error as JSON
    }
});