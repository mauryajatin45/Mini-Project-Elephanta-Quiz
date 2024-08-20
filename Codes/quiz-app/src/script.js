// Page navigation logic
document.addEventListener('DOMContentLoaded', () => {
  // Page navigation
  const showPage = (pageId) => {
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
  };

  document.getElementById('overview').onclick = () => showPage('overview-page');
  document.getElementById('create-quiz').onclick = () => showPage('create-quiz-page');
  document.getElementById('profile').onclick = () => showPage('profile-page');
  document.getElementById('Customer_support').onclick = () => showPage('Customer_support-page');

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

  // Toggle date input and time select
  const toggle = document.getElementById('toggle');
  const quizDate = document.getElementById('quizDate');
  const timeLimitToggle = document.getElementById('timeLimitToggle');
  const quizTime = document.getElementById('quizTime');

  const updateToggleStates = () => {
    quizDate.disabled = !toggle.checked;
    quizTime.disabled = !timeLimitToggle.checked;
    quizDate.classList.toggle('disabled-cursor', !toggle.checked);
    quizTime.classList.toggle('disabled-cursor', !timeLimitToggle.checked);
    if (!toggle.checked) quizDate.value = ''; // Clear date if disabled
    if (!timeLimitToggle.checked) quizTime.selectedIndex = 0; // Reset select if disabled
  };

  toggle.addEventListener('change', updateToggleStates);
  timeLimitToggle.addEventListener('change', updateToggleStates);

  // Initialize the state on page load
  updateToggleStates();

  // Card click event to navigate to Create Quiz page
  document.querySelector('.card1').addEventListener('click', () => showPage('create-quiz-page'));
});


//code for hamburger
document.querySelector('.hamburger-icon').addEventListener('click', function() {
  document.querySelector('.sidebar').classList.toggle('active');
});
