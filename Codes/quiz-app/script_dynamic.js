let shortQuestionCount = 0;
let mcqQuestionCount = 0;
let questionnumbering = 0;

document.getElementById('add-short-question').addEventListener('click', function() {
    const container = document.getElementById('question-container');
    shortQuestionCount++;
    questionnumbering++;

    const div = document.createElement('div');
    const uniqueClass = `short-question-${shortQuestionCount}`; 
    div.setAttribute('id', uniqueClass); 
    div.classList.add('short-question'); 
    div.classList.add(uniqueClass); 

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
    const uniqueClass = `mcq-question-${mcqQuestionCount}`; 
    div.setAttribute('id', uniqueClass); 
    div.classList.add('mcq-question'); 
    div.classList.add(uniqueClass); 

    div.innerHTML = `
        <label>Question ${questionnumbering}:</label>
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
});

document.getElementById('quiz-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

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
                options: [], // No options for short questions
                correctAnswer: '' // No correct answer for short questions
            });
        } else if (key.startsWith('mcq-question-')) {
            const questionIndex = key.match(/\d+$/)[0]; // Extract question number
            const options = [];
            ['1', '2', '3', '4'].forEach(opt => {
                const optionText = formData.get(`option${opt}-${questionIndex}`);
                if (optionText) {
                    options.push(optionText);
                }
            });

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

    // Log the data to check its format before sending
    console.log('Data being sent:', JSON.stringify(data, null, 2));

    fetch('http://localhost:3000/submit-quiz', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(result => {
        const feedbackDiv = document.getElementById('feedback');
        feedbackDiv.textContent = result;
        feedbackDiv.style.color = 'green';
        feedbackDiv.style.display = 'block';
    })
    .catch(error => {
        const feedbackDiv = document.getElementById('feedback');
        feedbackDiv.textContent = 'An error occurred. Please try again.';
        feedbackDiv.style.color = 'red';
        feedbackDiv.style.display = 'block';
    });
});


// console.log('Data being sent:', JSON.stringify(data, null, 2));
