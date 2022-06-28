const mongoose = require("mongoose")

const Adress = mongoose.model('Adress',{
    id_user: String,
    user_email: String,
    ip_adress: String,
    released: Boolean,
})

module.exports = Adress 