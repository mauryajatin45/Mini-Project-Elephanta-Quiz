const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');  // Import path module
const Quiz = require('./models/quiz'); // Adjust the path to where your model is located

const app = express();

// Apply CORS middleware
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname, 'src')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/quizApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000 // Increase the timeout
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Failed to connect to MongoDB:', err);
});

// Route to submit a new quiz
app.post('/submit-quiz', async (req, res) => {
    const { quizName, scheduleDate, timeLimit, questions } = req.body;

    try {
        // Create a new quiz without setting createdAt manually
        const newQuiz = new Quiz({
            name: quizName,
            scheduleDate: scheduleDate,
            timeLimit: timeLimit,
            questions: questions
            // createdAt will be set automatically by default: Date.now
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
        // Fetch the 'name' and 'createdAt' fields from each document in the 'quizzes' collection
        const quizzes = await Quiz.find({}, 'name createdAt');
        res.json(quizzes); // Send the quiz data as JSON to the frontend
    } catch (error) {
        res.status(500).send('Error fetching quizzes: ' + error.message);
    }
});

// Catch-all route to serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
