const mongoose = require("mongoose")

const Information = mongoose.model('Information',{
    description: String,
    value: Number,
})

module.exports = Information 