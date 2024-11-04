// Variables for tracking question counts
let shortQuestionCount = 0;
let mcqQuestionCount = 0;
let questionNumbering = 0;
const BASE_URL = "http://localhost:3000";

// Function to create a new short question
const addShortQuestion = () => {
    const container = document.getElementById("question-container");
    shortQuestionCount++;
    questionNumbering++;

    const div = document.createElement("div");
    const uniqueClass = `short-question-${shortQuestionCount}`;
    div.id = uniqueClass;
    div.className = `short-question ${uniqueClass}`;

    div.innerHTML = `
        <button class="delete-button" onclick="deleteQuestion('${uniqueClass}')">
            <svg viewBox="0 0 448 512" class="svgIcon" aria-label="Delete question">
                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
            </svg>
        </button>
        <label>Question ${questionNumbering}:</label>
        <input type="text" name="short-question-${shortQuestionCount}" placeholder="Enter your question" required>
    `;

    container.appendChild(div);
};

// Function to create a new MCQ question
const addMCQQuestion = () => {
    const container = document.getElementById("question-container");
    mcqQuestionCount++;
    questionNumbering++;

    const div = document.createElement("div");
    const uniqueClass = `mcq-question-${mcqQuestionCount}`;
    div.id = uniqueClass;
    div.className = `mcq-question ${uniqueClass}`;

    div.innerHTML = `
        <button class="delete-button" onclick="deleteQuestion('${uniqueClass}')">
            <svg viewBox="0 0 448 512" class="svgIcon" aria-label="Delete question">
                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
            </svg>
        </button>
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

// Function to delete a question
const deleteQuestion = (id) => {
    const element = document.getElementById(id);
    if (element) {
        element.remove();
        questionNumbering--;
    }
};

// Add event listeners for adding questions
document.getElementById("add-short-question").addEventListener("click", addShortQuestion);
document.getElementById("add-mcq-question").addEventListener("click", addMCQQuestion);

// Handle form submission
const handleFormSubmit = async (event) => {
    event.preventDefault();  // Prevent default form submission behavior
    event.stopPropagation(); // Stop event from bubbling up
    const form = event.target;

    // Collect form data and prepare the data object
    const formData = new FormData(form);
    const data = { questions: [] };

    let hasError = false;

    // Collect the questions from the form
    formData.forEach((value, key) => {
        if (key.startsWith("short-question-")) {
            if (!value) {
                hasError = true;
                form.querySelector(`input[name="${key}"]`).classList.add("error");
                return;
            }
            data.questions.push({ questionText: value, questionType: "Short", options: [], correctAnswer: "" });
        } else if (key.startsWith("mcq-question-")) {
            const questionIndex = key.match(/\d+$/)[0];
            const options = ["1", "2", "3", "4"].map(opt => formData.get(`option${opt}-${questionIndex}`)).filter(Boolean);
            if (options.length < 2) {
                hasError = true;
                form.querySelector(`input[name="mcq-question-${questionIndex}"]`).classList.add("error");
                return;
            }
            data.questions.push({ questionText: value, questionType: "MCQ", options, correctAnswer: formData.get(`correct-answer-${questionIndex}`) || "" });
        }
    });

    if (hasError) {
        alert("Please fill in all required fields correctly.");
        return;
    }

    try {
        // Collect additional fields for the quiz
        const name = document.getElementById('quizName').value;
        const scheduleDate = document.getElementById('quizDate').value;
        const timeLimit = document.getElementById('quizTime').value;

        // Include quiz details in the data object
        data.name = name || `Quiz-${new Date().toISOString()}`;
        data.scheduleDate = scheduleDate;
        data.timeLimit = timeLimit;

        // Send data to the backend server
        const response = await fetch(`${BASE_URL}/submit-quiz`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.text();
        const feedbackDiv = document.getElementById("feedback");

        // Display feedback message
        feedbackDiv.textContent = result;
        feedbackDiv.style.color = response.ok ? "green" : "red";
        feedbackDiv.style.display = "block";

        // Optionally reset the form after successful submission
        if (response.ok) {
            form.reset();
            questionNumbering = 0;
            shortQuestionCount = 0;
            mcqQuestionCount = 0;
            document.getElementById("question-container").innerHTML = ""; // Clear question container
        }

    } catch (error) {
        console.error("Fetch error:", error);
        const feedbackDiv = document.getElementById("feedback");
        feedbackDiv.textContent = "An error occurred. Please try again.";
        feedbackDiv.style.color = "red";
        feedbackDiv.style.display = "block";
    }
};

// Attach event listener for form submission
document.getElementById("quiz-form").addEventListener("submit", handleFormSubmit);

// Function to fetch quizzes and populate the table with clickable names
// Function to fetch quizzes and populate the table with clickable names
const fetchQuizzes = async () => {
    try {
        const response = await fetch(`${BASE_URL}/quizzes`);
        if (!response.ok) throw new Error("Network response was not ok");
        const quizzes = await response.json();

        const quizTableBody = document.querySelector("#quizTable tbody");
        quizTableBody.innerHTML = "";

        quizzes.forEach((quiz) => {
            const row = document.createElement("tr");
            const nameCell = document.createElement("td");
            const dateCell = document.createElement("td");

            // Create a link element for the quiz name and add click event to fetch quiz details
            const link = document.createElement("a");
            link.href = "#";
            link.textContent = quiz.name;
            link.addEventListener("click", () => fetchQuizDetailsAndDisplay(quiz._id, row)); // Fetch quiz details on click
            nameCell.appendChild(link);

            dateCell.textContent = new Date(quiz.createdAt).toLocaleString();
            row.appendChild(nameCell);
            row.appendChild(dateCell);

            quizTableBody.appendChild(row);
        });

        // Call fetchQuizCount after quizzes have been fetched and displayed
        fetchQuizCount(); // Call this to update the count
    } catch (err) {
        console.error("Error fetching quizzes:", err);
    }
};

// Function to fetch quiz count
const fetchQuizCount = async () => {
    try {
        const response = await fetch(`${BASE_URL}/quiz-count`);
        if (!response.ok) throw new Error("Failed to fetch quiz count");
        const data = await response.json();
        const quizCountElement = document.querySelector("#quiz-count");
        if (quizCountElement) {
            quizCountElement.textContent = `You have successfully created ${data.count} quiz${data.count > 1 ? 'es' : ''}.`;
            quizCountElement.style.display = data.count ? "block" : "none"; // Hide if count is 0
        }
    } catch (error) {
        console.error("Error fetching quiz count:", error);
    }
};

// Function to fetch and display the latest quiz
const fetchLatestQuiz = async () => {
    try {
        const response = await fetch(`${BASE_URL}/latest-quiz`);
        if (!response.ok) throw new Error("Network response was not ok");

        const latestQuiz = await response.json();
        const latestQuizDisplay = document.querySelector('.underline');

        // Update the text content with the latest quiz name
        latestQuizDisplay.textContent = latestQuiz.name || "No quizzes created yet"; // Fallback if name is empty

    } catch (error) {
        console.error("Error fetching latest quiz:", error);
        // Optionally handle error display
        const latestQuizDisplay = document.querySelector('.underline');
        latestQuizDisplay.textContent = "Error fetching latest quiz"; // Display error message
    }
};

// Call the fetchLatestQuiz function when the page loads
window.onload = () => {
    fetchQuizzes();  // Fetch quizzes as before
    fetchLatestQuiz(); // Fetch the latest quiz
};



// Function to fetch quiz details by ID and display them below the clicked row
const fetchQuizDetailsAndDisplay = async (quizId, row) => {
    try {
        const url = `${BASE_URL}/quiz/${quizId}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");

        const quiz = await response.json();
        displayQuizDetailsBelowRow(quiz, row);
    } catch (err) {
        console.error("Error fetching quiz details:", err);
    }
};

// Function to display quiz details below the clicked row in a read-only format
const displayQuizDetailsBelowRow = (quiz, row) => {
    const existingDetailsRow = document.querySelector(".quiz-details-row");
    if (existingDetailsRow) {
        existingDetailsRow.remove();
    }

    const detailsRow = document.createElement("tr");
    detailsRow.className = "quiz-details-row";
    const detailsCell = document.createElement("td");
    detailsCell.colSpan = 2; // Make the details cell span across both columns

    const detailsContainer = document.createElement("div");
    detailsContainer.className = "quiz-details-container";

    const title = document.createElement("h3");
    title.textContent = `Quiz Name: ${quiz.name}`;
    detailsContainer.appendChild(title);

    if (quiz.scheduleDate) {
        const scheduleDateDiv = document.createElement("div");
        scheduleDateDiv.innerHTML = `<strong>Scheduled Date:</strong> ${new Date(quiz.scheduleDate).toLocaleString()}`;
        detailsContainer.appendChild(scheduleDateDiv);
    }

    if (quiz.timeLimit) {
        const timeLimitDiv = document.createElement("div");
        timeLimitDiv.innerHTML = `<strong>Time Limit:</strong> ${quiz.timeLimit} Seconds per question`;
        detailsContainer.appendChild(timeLimitDiv);
    }

    quiz.questions.forEach((question, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.className = question.questionType === "MCQ" ? "mcq-question" : "short-question";

        const questionLabel = document.createElement("label");
        questionLabel.textContent = `Question ${index + 1}:`;
        questionDiv.appendChild(questionLabel);

        const questionInput = document.createElement("input");
        questionInput.type = "text";
        questionInput.value = question.questionText;
        questionInput.readOnly = true;
        questionDiv.appendChild(questionInput);

        if (question.questionType === "MCQ") {
            const optionsLabel = document.createElement("label");
            optionsLabel.textContent = "Options:";
            questionDiv.appendChild(optionsLabel);

            question.options.forEach((option) => {
                const optionInput = document.createElement("input");
                optionInput.type = "text";
                optionInput.value = option;
                optionInput.readOnly = true;
                questionDiv.appendChild(optionInput);
            });
        }

        detailsContainer.appendChild(questionDiv);
    });

    detailsCell.appendChild(detailsContainer);
    detailsRow.appendChild(detailsCell);
    row.parentNode.insertBefore(detailsRow, row.nextSibling);
};