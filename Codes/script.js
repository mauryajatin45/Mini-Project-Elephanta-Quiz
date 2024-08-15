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


document.getElementById('overview').addEventListener('click', function() {
    document.getElementById('overview-section').classList.add('active');
    document.getElementById('create-quiz-section').classList.remove('active');
});

document.getElementById('create-quiz').addEventListener('click', function() {
    document.getElementById('create-quiz-section').classList.add('active');
    document.getElementById('overview-section').classList.remove('active');
});

