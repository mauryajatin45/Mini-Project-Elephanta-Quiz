// Elements from the HTML document
const quizContainer = document.getElementById('quizContainer');
const resultContainer = document.getElementById('resultContainer');
const quizTitle = document.getElementById('quizTitle');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const timeLeftSpan = document.getElementById('timeLeft');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const submitBtn = document.getElementById('submitBtn'); // Submit button
const studentNameDisplay = document.getElementById('studentNameDisplay');
const questionTracker = document.getElementById('questiontracker'); // Question tracker container

// Variables to manage quiz state
let quizData = null; // Stores quiz data fetched from the server
let currentQuestionIndex = 0; // Index of the current question
let timer = null; // Timer object
let timeLeft = 30; // Time left for the current question
let studentName = localStorage.getItem('studentName') || 'Student'; // Student's name
let responses = []; // Array to store responses
let pausedTimeLeft = null; // Time left when the timer is paused

// Event listener for when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    studentNameDisplay.textContent = studentName; // Display student's name
    await fetchQuiz(); // Fetch and display the quiz data

    if (quizData && quizData.questions.length > 0) {
        quizContainer.classList.remove('hidden'); // Show the quiz container
        startQuestion(); // Start the quiz with the first question
        initializeQuestionTracker(); // Initialize question tracker
    }
});

// Event listener for the "Next" button
nextBtn.addEventListener('click', () => {
    saveResponse(); // Save the current response
    currentQuestionIndex++; // Move to the next question
    if (currentQuestionIndex < quizData.questions.length) {
        startQuestion(); // Display the next question
    } else {
        endQuiz(); // End the quiz if there are no more questions
    }
    updateQuestionTracker(); // Update question tracker
});

// Event listener for the "Previous" button
prevBtn.addEventListener('click', () => {
    saveResponse(); // Save the current response
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--; // Move to the previous question
        startQuestion(); // Display the previous question
    }
    updateQuestionTracker(); // Update question tracker
});

// Event listener for the "Submit" button
submitBtn.addEventListener('click', () => {
    saveResponse(); // Save the current response
    endQuiz(); // End the quiz and submit responses
});

/**
 * Fetches quiz data from the server and initializes the quiz.
 */
async function fetchQuiz() {
    try {
        const response = await fetch('http://localhost:5000/api/latest-quiz');
        if (!response.ok) throw new Error('Failed to fetch quiz data');
        quizData = await response.json();
        if (!quizData || !quizData.questions || quizData.questions.length === 0) {
            throw new Error('Invalid quiz data');
        }
        quizTitle.textContent = quizData.name; // Set the quiz title
    } catch (error) {
        alert('Error loading quiz: ' + error.message); // Show an error message if fetching fails
    }
}

/**
 * Initializes the question tracker.
 */
function initializeQuestionTracker() {
    if (!quizData || !quizData.questions.length) return;

    questionTracker.innerHTML = ''; // Clear previous tracker content
    quizData.questions.forEach((_, index) => {
        const box = document.createElement('div');
        box.classList.add('tracker-box');
        box.dataset.index = index;
        questionTracker.appendChild(box);
    });
}

/**
 * Updates the question tracker based on completed questions.
 */
function updateQuestionTracker() {
    const boxes = questionTracker.querySelectorAll('.tracker-box');
    boxes.forEach((box, index) => {
        if (index < currentQuestionIndex) {
            box.style.backgroundColor = 'green'; // Completed question
        } else if (index === currentQuestionIndex) {
            box.style.backgroundColor = 'yellow'; // Current question
        } else {
            box.style.backgroundColor = 'red'; // Upcoming question
        }
    });
}

/**
 * Starts displaying the current question and timer.
 */
function startQuestion() {
    if (!quizData || currentQuestionIndex < 0 || currentQuestionIndex >= quizData.questions.length) {
        console.error('Invalid question index');
        return;
    }
    resetTimer(); // Reset the timer
    displayQuestion(); // Display the current question
    startTimer(); // Start the timer
}

/**
 * Displays the current question and its options.
 */
function displayQuestion() {
    if (!quizData || currentQuestionIndex < 0 || currentQuestionIndex >= quizData.questions.length) {
        console.error('Invalid question index');
        return;
    }

    const question = quizData.questions[currentQuestionIndex];
    if (!question) {
        console.error('Question is undefined');
        return;
    }

    const questionNumber = currentQuestionIndex + 1;
    questionText.innerHTML = `<strong>Question ${questionNumber}:</strong> ${question.questionText}`;
    optionsContainer.innerHTML = ''; // Clear previous options

    const savedResponse = responses.find(response => response.questionId === question._id);

    if (savedResponse && !isCurrentQuestion()) {
        // Display saved response as disabled options
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
            inputElement.disabled = true;
            optionsContainer.appendChild(inputElement);
        }
    } else {
        // Display current options
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

    // Toggle visibility of navigation buttons
    prevBtn.classList.toggle('hidden', currentQuestionIndex === 0);
    nextBtn.classList.toggle('hidden', currentQuestionIndex >= quizData.questions.length - 1);
}

/**
 * Starts the timer for the current question.
 */
function startTimer() {
    if (!quizData) {
        console.error('Quiz data is not loaded');
        return;
    }

    if (pausedTimeLeft !== null) {
        timeLeft = pausedTimeLeft;
        pausedTimeLeft = null;
    } else {
        timeLeft = quizData.timeLimit || 30;
    }
    timeLeftSpan.textContent = timeLeft;
    updateCircleTimer(timeLeft);

    timer = setInterval(() => {
        timeLeft--;
        timeLeftSpan.textContent = timeLeft;
        updateCircleTimer(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timer);
            saveResponse();
            currentQuestionIndex++;
            if (currentQuestionIndex < quizData.questions.length) {
                startQuestion();
            } else {
                endQuiz();
            }
        }
    }, 1000);
}

/**
 * Updates the visual representation of the timer.
 * @param {number} timeLeft - The time left in seconds.
 */
function updateCircleTimer(timeLeft) {
    const totalTime = quizData.timeLimit || 30;
    const percentage = (timeLeft / totalTime) * 100;
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

/**
 * Resets the timer to the initial state.
 */
function resetTimer() {
    clearInterval(timer);
    timeLeft = quizData.timeLimit || 30;
    timeLeftSpan.textContent = timeLeft;
    updateCircleTimer(timeLeft);
}

/**
 * Saves the current response to the responses array.
 */
function saveResponse() {
    if (!quizData || currentQuestionIndex < 0 || currentQuestionIndex >= quizData.questions.length) {
        console.error('Invalid question index');
        return;
    }

    const question = quizData.questions[currentQuestionIndex];
    if (!question) {
        console.error('Question is undefined');
        return;
    }

    let answer = '';

    if (question.questionType === 'MCQ') {
        const selectedOption = document.querySelector('input[name="option"]:checked');
        answer = selectedOption ? selectedOption.value : 'No Answer';
    } else if (question.questionType === 'Short') {
        const shortAnswer = document.querySelector('input[name="shortAnswer"]').value.trim();
        answer = shortAnswer || 'No Answer';
    }

    const timeTaken = (quizData.timeLimit || 30) - timeLeft;

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

/**
 * Ends the quiz and shows the result.
 */
function endQuiz() {
    clearInterval(timer);
    quizContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    studentNameDisplay.textContent = studentName;

    submitResponses(); // Submit responses to the server
}

/**
 * Submits the responses to the server.
 */
async function submitResponses() {
    try {
        const response = await fetch('http://localhost:5000/api/submit-responses', {
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
        resultContainer.innerHTML += '<p>Responses submitted successfully!</p>';
    } catch (error) {
        console.error('Error submitting responses:', error);
        resultContainer.innerHTML += '<p>There was an error submitting your responses. Please try again.</p>';
    }
}

/**
 * Checks if the current question is already answered.
 * @returns {boolean} - True if the current question is answered, false otherwise.
 */
function isCurrentQuestion() {
    return responses.some(response => response.questionId === quizData.questions[currentQuestionIndex]._id);
}
