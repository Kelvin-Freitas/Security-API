const mongoose = require("mongoose")

const Information = mongoose.model('Information',{
    id: Number,
    description: String,
    value: Number,
})

module.exports = Information 