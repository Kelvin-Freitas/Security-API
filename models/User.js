const mongoose = require("mongoose")

const User = mongoose.model('User',{
    idUser: Number,
    username: String,
    password: String,
    email: String
})

module.exports = User 