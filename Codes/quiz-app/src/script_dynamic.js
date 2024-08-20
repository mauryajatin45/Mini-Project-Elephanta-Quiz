// Variables for tracking question counts
let shortQuestionCount = 0;
let mcqQuestionCount = 0;
let questionNumbering = 0;

// Function to create a new short question
const addShortQuestion = () => {
    const container = document.getElementById('question-container');
    shortQuestionCount++;
    questionNumbering++;

    const div = document.createElement('div');
    const uniqueClass = `short-question-${shortQuestionCount}`;
    div.id = uniqueClass;
    div.className = `short-question ${uniqueClass}`;

    div.innerHTML = `
        <label>Question ${questionNumbering}:</label>
        <input type="text" name="short-question-${shortQuestionCount}" placeholder="Enter your question" required>
    `;

    container.appendChild(div);
};

// Function to create a new MCQ question
const addMCQQuestion = () => {
    const container = document.getElementById('question-container');
    mcqQuestionCount++;
    questionNumbering++;

    const div = document.createElement('div');
    const uniqueClass = `mcq-question-${mcqQuestionCount}`;
    div.id = uniqueClass;
    div.className = `mcq-question ${uniqueClass}`;

    div.innerHTML = `
        <label>Question ${questionNumbering}:</label>
        <input type="text" name="mcq-question-${mcqQuestionCount}" placeholder="Enter your question" required>
        <br>
        <label>Options:</label>
        <input type="radio" name="option-${mcqQuestionCount}" required> <input type="text" name="option1-${mcqQuestionCount}" placeholder="Option 1" required><br>
        <input type="radio" name="option-${mcqQuestionCount}"> <input type="text" name="option2-${mcqQuestionCount}" placeholder="Option 2" required><br>
        <input type="radio" name="option-${mcqQuestionCount}"> <input type="text" name="option3-${mcqQuestionCount}" placeholder="Option 3"><br>
        <input type="radio" name="option-${mcqQuestionCount}"> <input type="text" name="option4-${mcqQuestionCount}" placeholder="Option 4"><br>
        <p class="note">*You need to fill at least 2 options before submitting the question</p>
    `;

    container.appendChild(div);
};

// Add event listeners for adding questions
document.getElementById('add-short-question').addEventListener('click', addShortQuestion);
document.getElementById('add-mcq-question').addEventListener('click', addMCQQuestion);

// Function to handle form submission
const handleFormSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const data = {
        questions: []
    };

    formData.forEach((value, key) => {
        if (key.startsWith('short-question-')) {
            data.questions.push({
                questionText: value,
                questionType: 'Short',
                options: [],
                correctAnswer: ''
            });
        } else if (key.startsWith('mcq-question-')) {
            const questionIndex = key.match(/\d+$/)[0];
            const options = ['1', '2', '3', '4'].map(opt => formData.get(`option${opt}-${questionIndex}`)).filter(opt => opt);

            data.questions.push({
                questionText: value,
                questionType: 'MCQ',
                options: options,
                correctAnswer: formData.get(`correct-answer-${questionIndex}`) || ''
            });
        } else {
            data[key] = value;
        }
    });

    try {
        const response = await fetch('http://localhost:3000/submit-quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.text();
        const feedbackDiv = document.getElementById('feedback');
        feedbackDiv.textContent = result;
        feedbackDiv.style.color = 'green';
        feedbackDiv.style.display = 'block';
    } catch (error) {
        const feedbackDiv = document.getElementById('feedback');
        feedbackDiv.textContent = 'An error occurred. Please try again.';
        feedbackDiv.style.color = 'red';
        feedbackDiv.style.display = 'block';
    }
};

// Add event listener for form submission
document.getElementById('quiz-form').addEventListener('submit', handleFormSubmit);

// Function to fetch quizzes and populate the table
const fetchQuizzes = async () => {
    try {
        const response = await fetch('http://localhost:3000/quizzes');
        if (!response.ok) throw new Error('Network response was not ok');
        const quizzes = await response.json();

        const quizTableBody = document.querySelector('#quizTable tbody');
        quizTableBody.innerHTML = quizzes.map(quiz => `
            <tr>
                <td>${quiz.name}</td>
                <td>${new Date(quiz.createdAt).toLocaleString()}</td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Error fetching quizzes:', err);
    }
};

// Fetch quizzes on page load
window.onload = fetchQuizzes;

// Function to fetch quiz count
const fetchQuizCount = async () => {
    try {
        const response = await fetch('http://localhost:3000/quiz-count');
        if (!response.ok) throw new Error('Failed to fetch quiz count');
        const data = await response.json();
        const quizCountElement = document.querySelector('#quiz-count');
        if (quizCountElement) {
            quizCountElement.textContent = `You have successfully completed ${data.count} quiz.`;
        }
    } catch (error) {
        console.error('Error fetching quiz count:', error);
    }
};

// Fetch quiz count on DOMContentLoaded
document.addEventListener('DOMContentLoaded', fetchQuizCount);
