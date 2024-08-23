// public/scripts/index.js

document.getElementById('startBtn').addEventListener('click', () => {
    const studentName = document.getElementById('studentName').value.trim();

    if (!studentName) {
        alert('Please enter your name to start the quiz.');
        return;
    }

    // Store student name in local storage
    localStorage.setItem('studentName', studentName);

    // Redirect to quiz page
    window.location.href = 'quiz.html';
});
