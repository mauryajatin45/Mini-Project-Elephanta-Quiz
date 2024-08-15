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


const menuItems = document.querySelectorAll('.menu-item');
const activeBar = document.querySelector('.active-bar');

menuItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    document.querySelector('.menu-item.active').classList.remove('active');
    item.classList.add('active');
    
    activeBar.style.top = `${index * 50}px`; // Assuming each menu item has a height of 50px
  });
});




document.getElementById('toggle').addEventListener('change', function() {
  if (this.checked) {
    console.log("Toggle is ON");
    // Add your "ON" state logic here
  } else {
    console.log("Toggle is OFF");
    // Add your "OFF" state logic here
  }
});


const toggleSwitch = document.getElementById('toggleSwitch');
    const quizDate = document.getElementById('quizDate');

    toggleSwitch.addEventListener('change', function() {
        if (toggleSwitch.checked) {
            quizDate.removeAttribute('disabled');
            quizDate.style.cursor = 'pointer';
        } else {
            quizDate.setAttribute('disabled', 'true');
            quizDate.style.cursor = 'not-allowed';
        }
    });

    // Initialize the state on page load
    if (!toggleSwitch.checked) {
        quizDate.setAttribute('disabled', 'true');
        quizDate.style.cursor = 'not-allowed';
    }