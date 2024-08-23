// models/Quiz.js

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    questionType: { type: String, enum: ['MCQ', 'Short'], required: true },
    options: [{ type: String }], // Only required if questionType is 'MCQ'
});

const quizSchema = new mongoose.Schema({
    name: { type: String, required: true },
    questions: [questionSchema],
    timeLimit: { type: Number, default: 30 }, // Default time limit per question in seconds
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Quiz', quizSchema);
