// Page navigation logic
document.getElementById('overview').onclick = function() {
    showPage('overview-page');
  }
  
  document.getElementById('create-quiz').onclick = function() {
    showPage('create-quiz-page');
  }
  
  // Update the selector to match the button or link triggering the profile page
  document.getElementById('profile').onclick = function() {
    showPage('profile-page');
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
  
  // Additional logic for toggle switch and form elements
  document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('toggle');
    const quizDate = document.getElementById('quizDate');
    const timeLimitToggle = document.getElementById('timeLimitToggle');
    const quizTime = document.getElementById('quizTime');
  
    // Toggle date input
    toggle.addEventListener('change', function () {
        if (toggle.checked) {
            quizDate.disabled = false;
            quizDate.classList.remove('disabled-cursor');
        } else {
            quizDate.disabled = true;
            quizDate.value = ''; // Clear the value when disabled
            quizDate.classList.add('disabled-cursor');
        }
    });
  
    // Toggle time select
    timeLimitToggle.addEventListener('change', function () {
        if (timeLimitToggle.checked) {
            quizTime.disabled = false;
            quizTime.classList.remove('disabled-cursor');
        } else {
            quizTime.disabled = true;
            quizTime.selectedIndex = 0; // Reset the select when disabled
            quizTime.classList.add('disabled-cursor');
        }
    });
  });
  
  // Initialize the state on page load
  document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('toggle');
    const quizDate = document.getElementById('quizDate');
    const quizTime = document.getElementById('quizTime');
  
    if (!toggle.checked) {
      quizDate.setAttribute('disabled', 'true');
      quizDate.style.cursor = 'not-allowed';
    }
    if (!timeLimitToggle.checked) {
      quizTime.setAttribute('disabled', 'true');  // Disable time input on load
      quizTime.style.cursor = 'not-allowed';
    }
  });
  

//card click logic 
// Page navigation logic
function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
      page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
}

// Card click event to navigate to Create Quiz page
document.querySelector('.card1').addEventListener('click', function() {
  showPage('create-quiz-page');
});

