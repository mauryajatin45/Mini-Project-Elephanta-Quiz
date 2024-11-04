document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.getElementById('form-container');
    const submitBtn = document.getElementById('submit-btn');
    const toggleBtn = document.getElementById('toggle-btn');
    const toggleText = document.getElementById('toggle-text');
    const additionalInfo = document.getElementById('additional-info');
    const countrySelect = document.getElementById('country');
    const stateSelect = document.getElementById('state');

    let isLogin = false;

    const toggleForm = () => {
        isLogin = !isLogin;
        updateFormUI();
    };

    const updateFormUI = () => {
        formContainer.querySelector('h2').textContent = isLogin ? 'Log In' : 'Sign Up';
        submitBtn.textContent = isLogin ? 'Log In' : 'Sign Up';
        toggleText.textContent = isLogin ? "Don't have an account?" : 'Already have an account?';
        toggleBtn.textContent = isLogin ? 'Sign Up' : 'Log In';
        additionalInfo.style.display = isLogin ? 'none' : 'block';
    };

    const signUp = async (userData) => {
        console.log(userData);
        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to sign up');
            }
            alert(data.message);
            toggleForm();
        } catch (error) {
            alert('Error during sign up: ' + error.message);
            console.error('Error details:', error);
        }
    };

    const logIn = async (userData) => {
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to log in');
            }
            alert(data.message);
            window.location.href = 'index.html';
        } catch (error) {
            alert('Error during login: ' + error.message);
            console.error('Login error:', error);
        }
    };

    const handleGoogleSignIn = async (response) => {
        const user = response.credential;
        const userInfo = JSON.parse(atob(user.split('.')[1]));

        try {
            const res = await fetch('http://localhost:5000/google-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: userInfo.sub, email: userInfo.email, name: userInfo.name }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to log in with Google');
            }
            alert(data.message);
            window.location.href = 'index.html';
        } catch (error) {
            alert('Error during Google login: ' + error.message);
            console.error('Google login error:', error);
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            const countries = await response.json();
            countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.cca2;
                option.textContent = country.name.common;
                countrySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    const fetchStates = async (countryCode) => {
        stateSelect.innerHTML = '<option value="">Select State</option>';
        stateSelect.style.display = 'none';

        const countryGeonameId = {
            'US': '6252001',
            'CA': '6252002',
        };

        if (countryCode in countryGeonameId) {
            try {
                const response = await fetch(`http://api.geonames.org/childrenJSON?geonameId=${countryGeonameId[countryCode]}&username=YOUR_USERNAME`);
                const data = await response.json();
                const states = data.geonames;

                states.forEach(state => {
                    const option = document.createElement('option');
                    option.value = state.geonameId;
                    option.textContent = state.name;
                    stateSelect.appendChild(option);
                });
                stateSelect.style.display = 'block';
            } catch (error) {
                console.error('Error fetching states:', error);
            }
        }
    };

    countrySelect.addEventListener('change', (e) => {
        const countryCode = e.target.value;
        fetchStates(countryCode);
    });

    submitBtn.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (isLogin) {
            logIn({ username, password });
        } else {
            const name = document.getElementById('name').value;
            const surname = document.getElementById('surname').value;
            const mobile = document.getElementById('mobile').value;
            const email = document.getElementById('email').value;
            const dob = document.getElementById('dob').value;
            const country = countrySelect.value;

            if (username && password && name && surname && mobile && email && dob && country) {
                signUp({ username, password, name, surname, mobile, email, dob, country });
            } else {
                alert('Please fill in all fields.');
            }
        }
    });

    toggleBtn.addEventListener('click', toggleForm);

    function initializeGoogleSignIn() {
        google.accounts.id.initialize({
            client_id: '1074089808265-467bp3smkiasr1jq7nfv7fp8drt57ird.apps.googleusercontent.com',
            callback: handleGoogleSignIn
        });
        google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            { theme: 'outline', size: 'large' }
        );
    }

    fetchCountries();
    updateFormUI();
    window.onload = initializeGoogleSignIn;
});
