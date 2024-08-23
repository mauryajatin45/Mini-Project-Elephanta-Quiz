// models/UserResponse.js

const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz.questions', required: true },
    answer: { type: String, required: true },
    timeTaken: { type: Number, required: true }, // Time taken to answer in seconds
});

const userResponseSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    responses: [responseSchema],
    completedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserResponse', userResponseSchema);
