const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Quiz = require('./models/quiz');
const User = require('./models/user'); // Import User model

// MongoDB connection URI
const uri = 'mongodb+srv://mauryajatin45:laxmi%23120224@cluster0.w6n0w.mongodb.net/userDB?retryWrites=true&w=majority';

// Create an instance of the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Apply CORS middleware
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware for parsing JSON bodies
// app.use(express.json());

// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname, 'src')));

// MongoDB connection
mongoose.connect(uri, {
    serverSelectionTimeoutMS: 30000 // Connection timeout setting
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB:', err));


// Route to submit a new quiz
// Route to submit a new quiz
// Route to submit a new quiz
// Route to submit a new quiz
app.post('/submit-quiz', async (req, res) => {
    console.log("Received request data on the server:", req.body);  // Log the request data for debugging

    // Destructure fields from the request body
    let { name, scheduleDate, timeLimit, questions } = req.body;

    // Generate a default quiz name based on the current date and time if name is not provided
    if (!name) {
        const now = new Date();
        const formattedDate = now.toISOString().split('T')[0];  // Get YYYY-MM-DD format
        const formattedTime = now.toTimeString().split(' ')[0].replace(/:/g, '-');  // Get HH-MM-SS format
        name = `Quiz-${formattedDate}-${formattedTime}`;  // Create a default quiz name
    }

    console.log("Assigned name:", name);  // Log the assigned name for debugging

    try {
        // Create a new quiz object
        const newQuiz = new Quiz({
            name,  // Use the provided or default name
            scheduleDate,
            timeLimit,
            questions,
        });

        await newQuiz.save();
        res.status(201).send('Quiz successfully created!');  // Send success message
    } catch (error) {
        res.status(400).send('Error creating quiz: ' + error.message);
    }
});


// Route to get the count of quizzes
app.get('/quiz-count', async (req, res) => {
    try {
        const count = await Quiz.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).send('Error fetching quiz count: ' + error.message);
    }
});

// Route to fetch all quizzes
app.get('/quizzes', async (req, res) => {
    try {
        const quizzes = await Quiz.find({}, 'name createdAt scheduleDate timeLimit');
        res.json(quizzes);
    } catch (error) {
        res.status(500).send('Error fetching quizzes: ' + error.message);
    }
});

// Route to fetch quiz details by ID
app.get('/quiz/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).send('Quiz not found');
        res.json(quiz);
    } catch (error) {
        res.status(500).send('Error fetching quiz details: ' + error.message);
    }
});

// Route to fetch user information
app.get('/api/user', async (req, res) => {
    try {
        const userId = req.session.userId; // Ensure you have session management
        if (!userId) return res.status(401).json({ message: 'User not authenticated' });

        const user = await User.findById(userId);
        if (user) {
            res.json({ name: user.name });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to fetch the latest quiz
app.get('/latest-quiz', async (req, res) => {
    try {
        const latestQuiz = await Quiz.findOne().sort({ createdAt: -1 }); // Get the most recently created quiz
        if (!latestQuiz) return res.status(404).json({ message: 'No quizzes found' }); // Handle case with no quizzes
        res.json(latestQuiz); // Send the latest quiz as JSON
    } catch (error) {
        console.error('Error fetching latest quiz:', error); // Log error for debugging
        res.status(500).json({ message: 'Error fetching latest quiz: ' + error.message }); // Return JSON error message
    }
});


// Catch-all route to serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Debug route (remove in production)
app.get('/debug', (req, res) => {
    res.json({ message: 'Debug route hit successfully' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});