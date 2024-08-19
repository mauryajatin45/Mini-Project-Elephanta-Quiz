const mongoose = require('mongoose');

// Define a schema for questions
const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    questionType: {
        type: String,
        enum: ['Short', 'MCQ'],
        required: true
    },
    options: [String], // Array of options for MCQ questions
    correctAnswer: String // Correct answer for MCQ questions
});

// Define a schema for quizzes
const quizSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    scheduleDate: Date,
    timeLimit: Number,
    questions: [questionSchema] // Embedding the question schema in the quiz schema
});

// Create a model based on the schema
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
