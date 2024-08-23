document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.getElementById('form-container');
    const submitBtn = document.getElementById('submit-btn');
    const toggleBtn = document.getElementById('toggle-btn');
    const toggleText = document.getElementById('toggle-text');

    let isLogin = false; // To toggle between login and sign-up

    const toggleForm = () => {
        isLogin = !isLogin;
        if (isLogin) {
            formContainer.querySelector('h2').textContent = 'Log In';
            submitBtn.textContent = 'Log In';
            toggleText.textContent = "Don't have an account?";
            toggleBtn.textContent = 'Sign Up';
        } else {
            formContainer.querySelector('h2').textContent = 'Sign Up';
            submitBtn.textContent = 'Sign Up';
            toggleText.textContent = 'Already have an account?';
            toggleBtn.textContent = 'Log In';
        }
    };

    const signUp = (username, password) => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.username === username);

        if (userExists) {
            alert('Username already exists. Please choose a different one.');
        } else {
            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Sign up successful! Please log in.');
            toggleForm();
        }
    };

    const logIn = (username, password) => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            alert('Login successful! Welcome back.');
            window.location.href = 'index.html'; // Redirect to the new page
        } else {
            alert('Invalid username or password.');
        }
    };

    submitBtn.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username && password) {
            if (isLogin) {
                logIn(username, password);
            } else {
                signUp(username, password);
            }
        } else {
            alert('Please fill in both fields.');
        }
    });

    toggleBtn.addEventListener('click', toggleForm);
});
