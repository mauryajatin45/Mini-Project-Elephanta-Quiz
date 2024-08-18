const express = require('express');
const mongoose = require('mongoose');
const Quiz = require('./quiz'); // Ensure this file is named and located correctly

const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/quizApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB", err));

// Route to handle form submission
app.post('/submit-quiz', async (req, res) => {
    const { quizName, scheduleDate, timeLimit, questions } = req.body;

    let parsedQuestions;
    try {
        if (typeof questions === 'string') {
            parsedQuestions = JSON.parse(questions);
        } else {
            parsedQuestions = questions;
        }

        if (!Array.isArray(parsedQuestions)) {
            throw new Error('Questions must be an array.');
        }

        parsedQuestions.forEach(q => {
            if (!q.questionText || !q.questionType || !Array.isArray(q.options) || !q.correctAnswer) {
                throw new Error('Each question must have text, type, options, and a correct answer.');
            }
        });
    } catch (err) {
        return res.status(400).send('Invalid data format: ' + err.message);
    }

    const newQuiz = new Quiz({
        quizName,
        scheduleDate: new Date(scheduleDate),
        timeLimit: parseInt(timeLimit, 10),
        questions: parsedQuestions
    });

    try {
        await newQuiz.save();
        res.send('Quiz created successfully');
    } catch (err) {
        res.status(500).send('Error creating quiz: ' + err.message);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
