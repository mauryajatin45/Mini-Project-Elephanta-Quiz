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

// Hamburger menu toggle
const hamburgerIcon = document.querySelector('.hamburger-icon');
const sidebar = document.querySelector('.sidebar');

hamburgerIcon.addEventListener('click', function () {
  sidebar.classList.toggle('active');
});

// Close hamburger menu when a menu item is selected
document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', () => {
    sidebar.classList.remove('active'); // Close the hamburger menu
  });
});

//code to fetch the country code from the server
document.addEventListener('DOMContentLoaded', () => {
  const countryCodeSelect = document.getElementById('countryCode');

  fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
          const sortedData = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
          sortedData.forEach(country => {
              const option = document.createElement('option');
              option.value = `${country.idd.root}${country.idd.suffixes ? country.idd.suffixes[0] : ''}`;
              option.textContent = `${country.flag} ${country.name.common} ${option.value}`;
              countryCodeSelect.appendChild(option);
          });
      })
      .catch(error => console.error('Error fetching country codes:', error));

  // Add keydown event listener to filter options
  countryCodeSelect.addEventListener('keydown', (event) => {
      const char = String.fromCharCode(event.keyCode).toLowerCase();
      const options = Array.from(countryCodeSelect.options);
      
      for (let i = 0; i < options.length; i++) {
          if (options[i].textContent.toLowerCase().startsWith(char)) {
              countryCodeSelect.selectedIndex = i;
              break;
          }
      }
  });
});
