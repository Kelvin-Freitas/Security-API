//config
const express = require("express")
const app = express()
const mongoose = require("mongoose")
require('dotenv').config()
//json - middleare
app.use(
    express.urlencoded({
        extended: true,
    }),
)
app.use(express.json())

//rota inicial
app.get('/', (req,res) => {
    res.json({ message: "API - 200 Success, In Execution"})
})

//rotas da API
const infoRoutes = require('./routes/infoRoutes')
app.use('/info', infoRoutes)

//portas de config 
app.listen(3500)

const DB_USER = process.env.DB_USER
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)

mongoose
  .connect(
    `mongodb+srv://StudyProjectsMongo:${DB_PASSWORD}@studyprojects.csahc.mongodb.net/?retryWrites=true&w=majority`,
  )
  .then(() => {
    console.log('Conectou ao banco!')
    app.listen(3000)
  })
  .catch((err) => console.log(err))