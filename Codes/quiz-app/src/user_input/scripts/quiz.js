// public/scripts/quiz.js

// Elements from the HTML document
const quizContainer = document.getElementById('quizContainer');
const resultContainer = document.getElementById('resultContainer');
const quizTitle = document.getElementById('quizTitle');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const timeLeftSpan = document.getElementById('timeLeft');
const nextBtn = document.getElementById('nextBtn');
const studentNameDisplay = document.getElementById('studentNameDisplay');
const finishBtn = document.getElementById('finishBtn');

// Variables to manage quiz state
let quizData = null; // Holds the quiz data fetched from the server
let currentQuestionIndex = 0; // Index of the current question being displayed
let timer = null; // Timer for tracking question time
let timeLeft = 30; // Time left for the current question
let studentName = localStorage.getItem('studentName') || 'Student'; // Student's name from local storage or default
let responses = []; // Array to store student responses

// Event listener for when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    studentNameDisplay.textContent = studentName; // Display the student's name
    await fetchQuiz(); // Fetch quiz data from the server
    startQuestion(); // Start the first question
});

// Event listener for the "Next" button to move to the next question
nextBtn.addEventListener('click', () => {
    saveResponse(); // Save the current question's response
    currentQuestionIndex++; // Move to the next question
    if (currentQuestionIndex < quizData.questions.length) {
        startQuestion(); // Display the next question
    } else {
        endQuiz(); // End the quiz if all questions have been answered
    }
});

// Event listener for the "Finish" button to navigate back to the homepage
finishBtn.addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirect to the homepage
});

// Function to fetch the latest quiz data from the server
async function fetchQuiz() {
    try {
        const response = await fetch('http://localhost:5000/api/latest-quiz'); // Updated URL
        if (!response.ok) throw new Error('Failed to fetch quiz data');

        quizData = await response.json();
        quizTitle.textContent = quizData.name;
    } catch (error) {
        alert('Error loading quiz: ' + error.message);
    }
}

// Function to start displaying a question and its timer
function startQuestion() {
    resetTimer(); // Reset timer for the new question
    displayQuestion(); // Display the current question
    startTimer(); // Start the timer
}

// Function to display the current question and its options
function displayQuestion() {
    const question = quizData.questions[currentQuestionIndex]; // Get the current question
    questionText.textContent = question.questionText; // Display the question text
    optionsContainer.innerHTML = ''; // Clear previous options

    if (question.questionType === 'MCQ' && question.options.length) {
        // Display MCQ options
        question.options.forEach((option) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.innerHTML = `
                <label>
                    <input type="radio" name="option" value="${option}">
                    ${option}
                </label>
            `;
            optionsContainer.appendChild(optionElement);
        });
    } else if (question.questionType === 'Short') {
        // Display Short answer input
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.name = 'shortAnswer';
        inputElement.placeholder = 'Your answer...';
        inputElement.style.width = '100%';
        inputElement.style.padding = '10px';
        inputElement.style.fontSize = '16px';
        optionsContainer.appendChild(inputElement);
    }

    nextBtn.classList.remove('hidden'); // Show the "Next" button
}

// Function to start the countdown timer for the current question
function startTimer() {
    timeLeft = quizData.timeLimit || 30; // Set timer duration
    timeLeftSpan.textContent = timeLeft; // Display initial time left

    // Timer interval to update time left every second
    timer = setInterval(() => {
        timeLeft--;
        timeLeftSpan.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer); // Stop the timer when time is up
            saveResponse(); // Save the response
            currentQuestionIndex++; // Move to the next question
            if (currentQuestionIndex < quizData.questions.length) {
                startQuestion(); // Display the next question
            } else {
                endQuiz(); // End the quiz if all questions are answered
            }
        }
    }, 1000);
}

// Function to reset the timer when a new question starts
function resetTimer() {
    clearInterval(timer); // Stop any existing timer
    timeLeft = quizData.timeLimit || 30; // Reset time left
    timeLeftSpan.textContent = timeLeft; // Update display
}

// Function to save the student's response for the current question
function saveResponse() {
    const question = quizData.questions[currentQuestionIndex]; // Get the current question
    let answer = '';

    if (question.questionType === 'MCQ') {
        // Get selected MCQ option
        const selectedOption = document.querySelector('input[name="option"]:checked');
        answer = selectedOption ? selectedOption.value : 'No Answer';
    } else if (question.questionType === 'Short') {
        // Get short answer input
        const shortAnswer = document.querySelector('input[name="shortAnswer"]').value.trim();
        answer = shortAnswer || 'No Answer';
    }

    const timeTaken = (quizData.timeLimit || 30) - timeLeft; // Calculate time taken for the question

    // Store the response
    responses.push({
        questionId: question._id,
        answer,
        timeTaken,
    });
}

// Function to handle the end of the quiz
function endQuiz() {
    clearInterval(timer); // Stop the timer
    quizContainer.classList.add('hidden'); // Hide the quiz container
    resultContainer.classList.remove('hidden'); // Show the result container
    submitResponses(); // Submit responses to the server
}

// Function to submit all responses to the server
async function submitResponses() {
    try {
        const response = await fetch('http://localhost:5000/api/submit-responses', { // Updated URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentName,
                quizId: quizData._id,
                responses,
            })
        });

        if (!response.ok) throw new Error('Failed to submit responses');

        const result = await response.json();
        console.log(result.message);
    } catch (error) {
        console.error('Error submitting responses:', error);
    }
}