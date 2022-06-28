//config
const express = require("express")
const app = express()
const mongoose = require("mongoose")

const Adresses = require('./models/Adresses')
const User = require('./models/User')

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

app.get('/ConfirmarUsuario', async(req,res) =>{
  var email = req.query.UserEmail
  var ip = req.query.UserIp 
  var token = req.query.UserToken 

  const user = await User.findOne({email:email, auth_token:token})
  if(!user)
    res.status(422).json({error: 'Não autorizado'})
  else{
    const adress = {
      id_user: user._id,
      user_email: email,
      ip_adress: ip,
      released: true
    }
    try{
      await Adresses.create(adress)
      res.status(201).json({message:"Acesso liberado!"})
    }catch(err){
      res.status(500).json({message: "Acesso não liberado.", error: err})
    }
  }
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
    console.log('Successfully connected to database')
    app.listen(3000)
  })
  .catch((error) => {
  console.log("database connection failed. exiting now...")
  console.error(error);
  process.exit(1);
  })