const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: String,
    questionType: String,
    options: [String],
    correctAnswer: String
});

const quizSchema = new mongoose.Schema({
    quizName: String,
    scheduleDate: Date,
    timeLimit: Number,
    questions: [questionSchema]
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
