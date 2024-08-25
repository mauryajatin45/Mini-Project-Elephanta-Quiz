// Elements from the HTML document
const quizContainer = document.getElementById('quizContainer');
const resultContainer = document.getElementById('resultContainer');
const quizTitle = document.getElementById('quizTitle');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const timeLeftSpan = document.getElementById('timeLeft');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn'); // Button for previous question
const studentNameDisplay = document.getElementById('studentNameDisplay');
const finishBtn = document.getElementById('finishBtn');

// Variables to manage quiz state
let quizData = null; // Holds the quiz data fetched from the server
let currentQuestionIndex = 0; // Index of the current question being displayed
let timer = null; // Timer for tracking question time
let timeLeft = 30; // Time left for the current question
let studentName = localStorage.getItem('studentName') || 'Student'; // Student's name from local storage or default
let responses = []; // Array to store student responses
let pausedTimeLeft = null; // Track time left when a question is paused

// Event listener for when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    studentNameDisplay.textContent = studentName; // Display the student's name
    await fetchQuiz(); // Fetch quiz data from the server

    // Show the quiz container after quiz data is fetched
    if (quizData && quizData.questions.length > 0) {
        quizContainer.classList.remove('hidden');
        startQuestion(); // Start the first question
    }
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

// Event listener for the "Previous" button to move to the previous question
prevBtn.addEventListener('click', () => {
    saveResponse(); // Save the current question's response
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--; // Move to the previous question
        startQuestion(); // Display the previous question
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
        if (!quizData || !quizData.questions || quizData.questions.length === 0) {
            throw new Error('Invalid quiz data');
        }

        quizTitle.textContent = quizData.name;
    } catch (error) {
        alert('Error loading quiz: ' + error.message);
    }
}

// Function to start displaying a question and its timer
function startQuestion() {
    if (!quizData || currentQuestionIndex < 0 || currentQuestionIndex >= quizData.questions.length) {
        console.error('Invalid question index');
        return;
    }

    resetTimer(); // Reset timer for the new question
    displayQuestion(); // Display the current question
    startTimer(); // Start the timer
}

function displayQuestion() {
    if (!quizData || currentQuestionIndex < 0 || currentQuestionIndex >= quizData.questions.length) {
        console.error('Invalid question index');
        return;
    }

    const question = quizData.questions[currentQuestionIndex]; // Get the current question
    if (!question) {
        console.error('Question is undefined');
        return;
    }

    // Format question number (1-based index)
    const questionNumber = currentQuestionIndex + 1;

    // Display the question text with the question number
    questionText.innerHTML = `<strong>Question ${questionNumber}:</strong> ${question.questionText}`;

    optionsContainer.innerHTML = ''; // Clear previous options

    // Check if we have a saved response for the current question
    const savedResponse = responses.find(response => response.questionId === question._id);
    
    if (savedResponse && !isCurrentQuestion()) {
        // If there's a saved response and it's not the current question, show it as read-only
        if (question.questionType === 'MCQ') {
            question.options.forEach((option) => {
                const optionElement = document.createElement('div');
                optionElement.classList.add('option');
                optionElement.innerHTML = `
                    <label>
                        <input type="radio" name="option" value="${option}" disabled ${savedResponse.answer === option ? 'checked' : ''}>
                        ${option}
                    </label>
                `;
                optionsContainer.appendChild(optionElement);
            });
        } else if (question.questionType === 'Short') {
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.name = 'shortAnswer';
            inputElement.value = savedResponse.answer;
            inputElement.placeholder = 'Your answer...';
            inputElement.style.width = '100%';
            inputElement.style.padding = '10px';
            inputElement.style.fontSize = '16px';
            inputElement.disabled = true; // Make it read-only
            optionsContainer.appendChild(inputElement);
        }
    } else {
        // Display options normally if it's the current question
        if (question.questionType === 'MCQ' && question.options.length) {
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
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.name = 'shortAnswer';
            inputElement.placeholder = 'Your answer...';
            inputElement.style.width = '100%';
            inputElement.style.padding = '10px';
            inputElement.style.fontSize = '16px';
            optionsContainer.appendChild(inputElement);
        }
    }

    // Adjust visibility of Previous, Next, and Finish buttons
    prevBtn.classList.toggle('hidden', currentQuestionIndex === 0);
    nextBtn.classList.toggle('hidden', currentQuestionIndex >= quizData.questions.length - 1);
    finishBtn.classList.toggle('hidden', currentQuestionIndex < quizData.questions.length - 1);
}

// Function to start the countdown timer for the current question
function startTimer() {
    if (!quizData) {
        console.error('Quiz data is not loaded');
        return;
    }

    if (pausedTimeLeft !== null) {
        timeLeft = pausedTimeLeft; // Resume with the paused time left
        pausedTimeLeft = null;
    } else {
        timeLeft = quizData.timeLimit || 30; // Set timer duration
    }
    timeLeftSpan.textContent = timeLeft; // Display initial time left
    updateCircleTimer(timeLeft); // Update the circle timer

    // Timer interval to update time left every second
    timer = setInterval(() => {
        timeLeft--;
        timeLeftSpan.textContent = timeLeft;
        updateCircleTimer(timeLeft);

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

// Function to update the circular timer's progress
function updateCircleTimer(timeLeft) {
    const totalTime = quizData.timeLimit || 30; // Total time for the question
    const percentage = (timeLeft / totalTime) * 100; // Calculate the percentage of remaining time
    const circleTimer = document.getElementById('circleTimer');
    
    if (circleTimer) {
        circleTimer.style.background = `conic-gradient(
            red ${100 - percentage}%,
            green ${100 - percentage}% 100%
        )`;
    } else {
        console.error('Circle timer element not found');
    }
}

// Function to reset the timer when a new question starts
function resetTimer() {
    clearInterval(timer); // Stop any existing timer
    timeLeft = quizData.timeLimit || 30; // Reset time left for the next question
    timeLeftSpan.textContent = timeLeft; // Update the displayed time
    updateCircleTimer(timeLeft); // Reset the circular timer
}


// Function to save the student's response for the current question
function saveResponse() {
    if (!quizData || currentQuestionIndex < 0 || currentQuestionIndex >= quizData.questions.length) {
        console.error('Invalid question index');
        return;
    }

    const question = quizData.questions[currentQuestionIndex]; // Get the current question
    if (!question) {
        console.error('Question is undefined');
        return;
    }

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
    const existingResponseIndex = responses.findIndex(response => response.questionId === question._id);
    if (existingResponseIndex >= 0) {
        responses[existingResponseIndex] = {
            questionId: question._id,
            answer,
            timeTaken,
        };
    } else {
        responses.push({
            questionId: question._id,
            answer,
            timeTaken,
        });
    }
}

// Function to handle the end of the quiz
function endQuiz() {
    clearInterval(timer); // Stop the timer
    quizContainer.classList.add('hidden'); // Hide the quiz container
    resultContainer.classList.remove('hidden'); // Show the result container

    // Set student's name in result container
    studentNameDisplay.textContent = studentName;

    // Check if the quiz is completed and manage visibility of completion-container
    const quizCompleted = responses.length === quizData.questions.length; // Example condition
    if (quizCompleted) {
        document.getElementById('completion-container').classList.remove('hidden');
    } else {
        document.getElementById('completion-container').classList.add('hidden');
    }

    // Submit responses to the server
    submitResponses();
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

        // Display a success message
        resultContainer.innerHTML += '<p>Responses submitted successfully!</p>';
    } catch (error) {
        console.error('Error submitting responses:', error);
        resultContainer.innerHTML += '<p>There was an error submitting your responses. Please try again.</p>';
    }
}

// Helper function to check if the current question is editable
function isCurrentQuestion() {
    return currentQuestionIndex === responses.find(response => response.questionId === quizData.questions[currentQuestionIndex]._id)?.questionId;
}

// 