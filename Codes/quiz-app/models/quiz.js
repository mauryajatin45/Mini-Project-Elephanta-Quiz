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
    options: [String],
    correctAnswer: String
});

// Define a schema for quizzes
const quizSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    scheduleDate: Date,
    timeLimit: Number,
    questions: [questionSchema],
    createdAt: {
        type: Date,
        default: Date.now // Automatically set to the current date and time when a document is created
    }
});

// Create a model based on the schema
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
