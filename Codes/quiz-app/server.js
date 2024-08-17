const mongoose = require('mongoose'); // Ensure this is declared only once

const Quiz = require('./quiz'); // Import your Quiz model

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/quizApp')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB", err));

const newQuiz = new Quiz({
    quizName: 'Sample Quiz',
    scheduleDate: new Date(),
    timeLimit: 30, // in seconds
    questions: [
        {
            questionText: 'What is 2 + 2?',
            questionType: 'MCQ',
            options: ['3', '4', '5', '6'],
            correctAnswer: '4',
        },
        {
            questionText: 'What is the capital of France?',
            questionType: 'ShortAnswer',
            correctAnswer: 'Paris',
        }
    ]
});

newQuiz.save()
    .then(() => console.log('Quiz saved successfully'))
    .catch(err => console.error('Error saving quiz:', err));


    const express = require('express');
const mongoose = require('mongoose');
const Quiz = require('./quiz'); // Your Quiz model
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/quizApp', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error', err));

// Route to handle form submission
app.post('/submit-quiz', (req, res) => {
    const { quizName, scheduleDate, timeLimit, questions } = req.body;

    const newQuiz = new Quiz({
        quizName,
        scheduleDate: new Date(scheduleDate),
        timeLimit,
        questions: JSON.parse(questions) // Assuming questions is sent as a JSON string
    });

    newQuiz.save()
        .then(() => res.send('Quiz created successfully'))
        .catch(err => res.status(500).send('Error creating quiz: ' + err));
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
