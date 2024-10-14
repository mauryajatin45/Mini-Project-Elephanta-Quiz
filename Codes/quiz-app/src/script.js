document.addEventListener('DOMContentLoaded', () => {
    // Function to show a specific page based on its ID
    const showPage = (pageId) => {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
    };

    // Define the page buttons and attach click events
    const overviewBtn = document.getElementById('overview');
    const createQuizBtn = document.getElementById('create-quiz');
    const profileBtn = document.getElementById('profile');
    const customerSupportBtn = document.getElementById('Customer_support');

    overviewBtn.onclick = () => showPage('overview-page');
    createQuizBtn.onclick = () => showPage('create-quiz-page');
    profileBtn.onclick = () => showPage('profile-page');
    customerSupportBtn.onclick = () => showPage('Customer_support-page');

    // Show the overview page by default
    showPage('overview-page');

    // Menu navigation logic with active bar
    const menuItems = document.querySelectorAll('.menu-item');
    const activeBar = document.querySelector('.active-bar');

    menuItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            document.querySelector('.menu-item.active')?.classList.remove('active');
            item.classList.add('active');
            activeBar.style.top = `${index * 50}px`; // Adjust based on menu item height
        });
    });

    // Toggle date input and time limit selection
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

    // Card click event to navigate to the Create Quiz page
    document.querySelector('.card1').addEventListener('click', () => showPage('create-quiz-page'));

    // Hamburger menu toggle for sidebar
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const sidebar = document.querySelector('.sidebar');

    hamburgerIcon.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Close hamburger menu when a menu item is selected
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            sidebar.classList.remove('active'); // Close the hamburger menu
        });
    });

    // Fetch the country code from the server
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
        .catch(error => {
            console.error('Error fetching country codes:', error);
            alert("Could not load country codes. Please try again later.");
        });

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

// Async function to fetch the username and update the profile name
async function fetchUserName() {
    try {
        const response = await fetch('/api/user');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        document.getElementById('fetch_name').textContent = data.name; // Update the UI with the user name
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Call the fetchUserName function when the page loads
window.onload = fetchUserName;



let personalDetailName = document.querySelector('#personal-details-name');
personalDetailName.innerText = 'Name'