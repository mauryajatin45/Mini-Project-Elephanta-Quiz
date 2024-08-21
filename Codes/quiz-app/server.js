// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const Quiz = require('./models/quiz');

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
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
    try {
        const count = await Quiz.countDocuments(); // Get the number of documents in the quizzes collection
        res.json({ count }); // Send the count as JSON
    } catch (error) {
        res.status(500).send('Error fetching quiz count: ' + error.message);
    }
});

// Route to fetch all quizzes with names and creation dates
app.get('/quizzes', async (req, res) => {
    try {
        const quizzes = await Quiz.find({}, 'name createdAt');
        res.json(quizzes);
    } catch (error) {
        res.status(500).send('Error fetching quizzes: ' + error.message);
    }
});

// Route to fetch quiz details by ID
app.get('/quiz/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).send('Quiz not found');
        }
        res.json(quiz);
    } catch (error) {
        console.error('Error fetching quiz details:', error);
        res.status(500).send('Error fetching quiz details');
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
