const mongoose = require("mongoose")

const Adress = mongoose.model('Adress',{
    id_user: Number,
    ip_adress: String,
    released: Boolean,
})

module.exports = Adress 