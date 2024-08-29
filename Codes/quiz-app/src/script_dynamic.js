// Variables for tracking question counts
let shortQuestionCount = 0;
let mcqQuestionCount = 0;
let questionNumbering = 0;

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
            <svg viewBox="0 0 448 512" class="svgIcon">
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
            <svg viewBox="0 0 448 512" class="svgIcon">
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

const deleteQuestion = (id) => {
    const element = document.getElementById(id);
    if (element) {
        element.remove();
        questionNumbering--;
    }
};


// Add event listeners for adding questions
document
    .getElementById("add-short-question")
    .addEventListener("click", addShortQuestion);
document
    .getElementById("add-mcq-question")
    .addEventListener("click", addMCQQuestion);

// Function to handle form submission
const handleFormSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const data = {
        questions: [],
    };

    formData.forEach((value, key) => {
        if (key.startsWith("short-question-")) {
            data.questions.push({
                questionText: value,
                questionType: "Short",
                options: [],
                correctAnswer: "",
            });
        } else if (key.startsWith("mcq-question-")) {
            const questionIndex = key.match(/\d+$/)[0];
            const options = ["1", "2", "3", "4"]
                .map((opt) => formData.get(`option${opt}-${questionIndex}`))
                .filter((opt) => opt);

            data.questions.push({
                questionText: value,
                questionType: "MCQ",
                options: options,
                correctAnswer: formData.get(`correct-answer-${questionIndex}`) || "",
            });
        } else {
            data[key] = value;
        }
    });

    try {
        const response = await fetch("http://localhost:3000/submit-quiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const result = await response.text();
        const feedbackDiv = document.getElementById("feedback");
        feedbackDiv.textContent = result;
        feedbackDiv.style.color = "green";
        feedbackDiv.style.display = "block";
    } catch (error) {
        const feedbackDiv = document.getElementById("feedback");
        feedbackDiv.textContent = "An error occurred. Please try again.";
        feedbackDiv.style.color = "red";
        feedbackDiv.style.display = "block";
    }
};

// Add event listener for form submission
document
    .getElementById("quiz-form")
    .addEventListener("submit", handleFormSubmit);

// Function to fetch quizzes and populate the table with clickable names
const fetchQuizzes = async () => {
    try {
        const response = await fetch("http://localhost:3000/quizzes");
        if (!response.ok) throw new Error("Network response was not ok");
        const quizzes = await response.json();

        const quizTableBody = document.querySelector("#quizTable tbody");
        quizTableBody.innerHTML = "";

        quizzes.forEach((quiz) => {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            const link = document.createElement("a");
            link.href = "#";
            link.textContent = quiz.name;
            link.addEventListener("click", () => fetchQuizDetails(quiz._id)); // Fetch quiz details on click
            nameCell.appendChild(link);

            const dateCell = document.createElement("td");
            dateCell.textContent = new Date(quiz.createdAt).toLocaleString();

            row.appendChild(nameCell);
            row.appendChild(dateCell);

            quizTableBody.appendChild(row);
        });
    } catch (err) {
        console.error("Error fetching quizzes:", err);
    }
};

// Fetch quizzes on page load
window.onload = fetchQuizzes;

// Function to fetch quiz details by ID and display them in a read-only form
const fetchQuizDetails = async (quizId) => {
    try {
        const url = `http://localhost:3000/quiz/${quizId}`;
        console.log(`Fetching quiz details from: ${url}`);
        const response = await fetch(url);
        const contentType = response.headers.get("content-type");

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        if (contentType && contentType.includes("application/json")) {
            const quiz = await response.json();
            displayQuizDetails(quiz);
        } else {
            console.error("Expected JSON, but received:", await response.text());
        }
    } catch (err) {
        console.error("Error fetching quiz details:", err);
    }
};

const displayQuizDetails = (quiz) => {
    const form = document.getElementById("quiz-details-form");
    form.innerHTML = ""; // Clear any previous quiz details

    const title = document.createElement("h3");
    title.textContent = quiz.name;
    form.appendChild(title);

    // Display scheduled date if available
    if (quiz.scheduleDate) {
        const scheduleDateDiv = document.createElement("div");
        scheduleDateDiv.innerHTML = `
            <label style="font-weight: bold;">Scheduled Date:</label>
            <span>${new Date(quiz.scheduleDate).toLocaleString()}</span>
        `;
        form.appendChild(scheduleDateDiv);
    }

    // Display time limit if available
    if (quiz.timeLimit) {
        const timeLimitDiv = document.createElement("div");
        timeLimitDiv.innerHTML = `
            <label style="font-weight: bold;">Time Limit:</label>
            <span>${quiz.timeLimit} Seconds per question</span>
        `;
        form.appendChild(timeLimitDiv);
    }

    // Display questions
    quiz.questions.forEach((question, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.className = "question";
        questionDiv.className = "short-question";
        // questionDiv.className = 'mcq-question';

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

        form.appendChild(questionDiv);
    });

    // Show the quiz details form
    document.getElementById("quiz-details-container").style.display = "block";
};

// Function to fetch quiz count
const fetchQuizCount = async () => {
    try {
        const response = await fetch("http://localhost:3000/quiz-count");
        if (!response.ok) throw new Error("Failed to fetch quiz count");
        const data = await response.json();
        // console.log('Quiz count response data:', data); // Debug log
        const quizCountElement = document.querySelector("#quiz-count");
        if (quizCountElement) {
            quizCountElement.textContent = `You have successfully created ${data.count} quiz${data.count > 1 ? 'zes' : ''}.`;
        }
    } catch (error) {
        console.error("Error fetching quiz count:", error);
    }
};

// Call the function to fetch the quiz count
fetchQuizCount();

document.getElementById('toggle').addEventListener('change', function() {
    const quizDateInput = document.getElementById('quizDate');
    if (this.checked) {
        quizDateInput.disabled = false;

        // Fetch current date from the internet
        fetch('https://worldtimeapi.org/api/ip')
            .then(response => response.json())
            .then(data => {
                const currentDate = new Date(data.datetime);
                const formattedDate = currentDate.toISOString().split('T')[0];
                
                // Set min attribute to current date
                quizDateInput.setAttribute('min', formattedDate);
            })
            .catch(error => console.error('Error fetching date:', error));
    } else {
        quizDateInput.disabled = true;
    }
});
