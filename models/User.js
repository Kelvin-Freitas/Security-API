const mongoose = require("mongoose")

const User = mongoose.model('User',{
    username: String,
    password: String,
    email: String,
    auth_token: String
})

module.exports = User 