document.getElementById('add-short-question').addEventListener('click', function() {
    const container = document.getElementById('question-container');
    
    const div = document.createElement('div');
    div.innerHTML = `
        <label>Short Question:</label>
        <input type="text" name="short-question" placeholder="Enter your question">
    `;
    
    container.appendChild(div);
});

document.getElementById('add-mcq-question').addEventListener('click', function() {
    const container = document.getElementById('question-container');
    
    const div = document.createElement('div');
    div.innerHTML = `
        <label>MCQ Question:</label>
        <input type="text" name="mcq-question" placeholder="Enter your question">
        <br>
        <label>Options:</label>
        <input type="radio" name="option"> <input type="text" placeholder="Option 1"><br>
        <input type="radio" name="option"> <input type="text" placeholder="Option 2"><br>
        <input type="radio" name="option"> <input type="text" placeholder="Option 3"><br>
        <input type="radio" name="option"> <input type="text" placeholder="Option 4"><br>
    `;
    
    container.appendChild(div);
});
