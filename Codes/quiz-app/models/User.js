const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    // Add other user fields as necessary
});

module.exports = mongoose.model('User', userSchema);
