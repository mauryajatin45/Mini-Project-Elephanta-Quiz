const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS package
const Quiz = require('./src/quiz'); // Adjust path to where your model is located

const app = express();

// Apply CORS middleware
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

app.use(bodyParser.json());

app.post('/submit-quiz', async (req, res) => {
    const { quizName, scheduleDate, timeLimit, questions } = req.body;

    try {
        const newQuiz = new Quiz({
            name: quizName,
            scheduleDate: scheduleDate,
            timeLimit: timeLimit,
            questions: questions
        });

        await newQuiz.save();
        res.status(201).send('Quiz successfully created!');
    } catch (error) {
        res.status(400).send('Error creating quiz: ' + error.message);
    }
});

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
