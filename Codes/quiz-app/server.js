const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/quizDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Define a schema and model
const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String
});

const Quiz = mongoose.model('Quiz', quizSchema);

// Routes
app.post('/submit-quiz', async (req, res) => {
  const { question, options, correctAnswer } = req.body;

  const newQuiz = new Quiz({
    question,
    options,
    correctAnswer
  });

  try {
    await newQuiz.save();
    res.status(201).send('Quiz saved successfully');
  } catch (err) {
    res.status(400).send('Error saving quiz: ' + err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
