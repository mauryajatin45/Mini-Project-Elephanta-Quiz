// Page navigation logic
document.getElementById('overview').onclick = function() {
  showPage('overview-page');
}

document.getElementById('create-quiz').onclick = function() {
  showPage('create-quiz-page');
}

function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
      page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
}

// Show the overview page by default
showPage('overview-page');

// Menu navigation with active bar
const menuItems = document.querySelectorAll('.menu-item');
const activeBar = document.querySelector('.active-bar');

menuItems.forEach((item, index) => {
  item.addEventListener('click', () => {
      document.querySelector('.menu-item.active').classList.remove('active');
      item.classList.add('active');
      activeBar.style.top = `${index * 50}px`; // Adjust based on menu item height
  });
});

// Toggle switch logic for enabling/disabling date and time inputs
const toggleSwitch = document.getElementById('toggle');
const quizDate = document.getElementById('quizDate');
const quizTime = document.getElementById('quizTime');  // Reference to time input

toggleSwitch.addEventListener('change', function() {
  if (this.checked) {
      quizDate.removeAttribute('disabled');
      quizDate.style.cursor = 'pointer';
      quizTime.removeAttribute('disabled');  // Enable time input
      quizTime.style.cursor = 'pointer';
  } else {
      quizDate.setAttribute('disabled', 'true');
      quizDate.style.cursor = 'not-allowed';
      quizTime.setAttribute('disabled', 'true');  // Disable time input
      quizTime.style.cursor = 'not-allowed';
  }
});

// Initialize the state on page load
if (!toggleSwitch.checked) {
  quizDate.setAttribute('disabled', 'true');
  quizDate.style.cursor = 'not-allowed';
  quizTime.setAttribute('disabled', 'true');  // Disable time input on load
  quizTime.style.cursor = 'not-allowed';
}

// Quiz form submission logic
document.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.querySelector('.submit');

  submitButton.addEventListener('click', async (e) => {
      e.preventDefault();

      // Collect form data
      const question1 = document.getElementById('question1').value.trim();
      const optionA = document.getElementById('optionA').value.trim();
      const optionB = document.getElementById('optionB').value.trim();
      const optionC = document.getElementById('optionC').value.trim();
      const optionD = document.getElementById('optionD').value.trim();
      const correctAnswer = document.getElementById('answer1').value.trim();

      // Validate form data
      if (!question1 || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
          alert('Please fill out all required fields.');
          return;
      }

      // Prepare the data to be sent
      const quizData = {
          question: question1,
          options: [optionA, optionB, optionC, optionD],
          correctAnswer: correctAnswer
      };

      try {
          const response = await fetch('http://localhost:3000/submit-quiz', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(quizData)
          });

          if (response.ok) {
              alert('Quiz submitted successfully!');
          } else {
              alert('Failed to submit quiz');
          }
      } catch (error) {
          console.error('Error:', error);
      }
  });
});
