let shortQuestionCount = 0;
let mcqQuestionCount = 0;
let questionnumbering = 0;

document.getElementById('add-short-question').addEventListener('click', function() {
    const container = document.getElementById('question-container');
    shortQuestionCount++;
    questionnumbering++;

    const div = document.createElement('div');
    const uniqueClass = `short-question-${shortQuestionCount}`; // Unique class
    const commonClass = `short-question`; // Common class
    div.setAttribute('id', uniqueClass); // Unique ID
    div.classList.add(uniqueClass); // Add unique class
    div.classList.add(commonClass); // Add common class

    div.innerHTML = `
        <label>Question ${questionnumbering}:</label>
        <input type="text" name="short-question-${shortQuestionCount}" placeholder="Enter your question" required>
    `;

    container.appendChild(div);
});

document.getElementById('add-mcq-question').addEventListener('click', function() {
    const container = document.getElementById('question-container');
    mcqQuestionCount++;
    questionnumbering++;

    const div = document.createElement('div');
    const uniqueClass = `mcq-question-${mcqQuestionCount}`; // Unique class
    const commonClass = `mcq-question`; // Common class
    div.setAttribute('id', uniqueClass); // Unique ID
    div.classList.add(uniqueClass); // Add unique class
    div.classList.add(commonClass); // Add common class

    div.innerHTML = `
        <label>Question ${questionnumbering}:</label>
        <input type="text" name="mcq-question-${mcqQuestionCount}" placeholder="Enter your question" required>
        <br>
        <label>Options:</label>
        <input type="radio" name="option-${mcqQuestionCount}" required> <input type="text" name="option1-${mcqQuestionCount}" placeholder="Option 1" required><br>
        <input type="radio" name="option-${mcqQuestionCount}"> <input type="text" name="option2-${mcqQuestionCount}" placeholder="Option 2" required><br>
        <input type="radio" name="option-${mcqQuestionCount}"> <input type="text" name="option3-${mcqQuestionCount}" placeholder="Option 3"><br>
        <input type="radio" name="option-${mcqQuestionCount}"> <input type="text" name="option4-${mcqQuestionCount}" placeholder="Option 4"><br>
        <p class="note">*You need to fill atleast 2 options before submiting the question</p>
    `;

    container.appendChild(div);
});

// Form validation before submission
document.getElementById('quiz-form').addEventListener('submit', function(event) {
    let isValid = true;
    const requiredFields = document.querySelectorAll('input[required]');

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = 'red'; // Highlight the field in red if empty
        } else {
            field.style.borderColor = ''; // Reset border color if filled
        }
    });

    if (!isValid) {
        event.preventDefault(); // Prevent form submission if validation fails
        alert('Please fill out all required fields.');
    }
});
