const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String, // store hashed password
});

module.exports = mongoose.model('User', userSchema);
