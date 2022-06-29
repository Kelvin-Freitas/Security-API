const router =  require('express').Router()
var nodemailer = require("nodemailer")
const auth = require("../middleware/auth")
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require("jsonwebtoken")

const Adresses = require('../models/Adresses')
const Information = require('../models/Information')
const User = require('../models/User')

router.post('/', async(req,res) => {
    const {username,password,email,token} = req.body
    if(!username || !password){
        res.status(422).json({error: 'Não informado todas as credenciais necessárias.'})
    }
    
    encryptedPassword = await bcrypt.hash(password, 10);
    const user = {
        username,
        password: encryptedPassword,
        email: email.toLowerCase()
    }
    try{
        const emailjwt = email.toLowerCase()
        await User.create(user)
        const token = jwt.sign(
            { user_id: user._id, emailjwt },
            process.env.TOKEN_KEY,
            {
            expiresIn: "2h",
            }
        );
        res.status(201).json({message:"Usuário cadastrado com sucesso!"})
    }catch(error){
        res.status(500).json({error: "Usuário não foi cadastrado."})
    }
})

router.get('/', async(req,res) => {
    try{
        const ipClient = req.socket.remoteAddress
        const {username,password,token} = req.body
        
        if(!username || !password || !token){
            res.status(400).json({error: 'Não informado todas as credenciais necessárias.'})
        }
        else if(token != process.env.TOKEN_KEY){
            res.status(400).json({error: 'Credenciais inválidas.'})
        }else{
            const user = await User.findOne({username:username})
            if(!user){
                res.status(422).json({error: 'Usuário não encontrado.'})
            }
            else if (user && (await bcrypt.compare(password, user.password))){
                const email = user.email
                const token = jwt.sign(
                    { user_id: user._id, email },
                    process.env.TOKEN_KEY,
                    {
                    expiresIn: "2h",
                    }
                )
                const adress = await Adresses.findOne({ip_adress: ipClient, id_user: user._id})
                if(!adress){
                    const randomHash = crypto.randomBytes(20).toString('hex')
                    user.auth_token = randomHash
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                        user: process.env.EMAIL_FROM,
                        pass: process.env.EMAIL_PASS
                        }
                    })
                    
                    const mailOptions = {
                        from: process.env.EMAIL_FROM,
                        to: 'kelvin.arg11@gmail.com',
                        subject: 'Liberar Acesso',
                        text: "Email de liberação de acesso",
                        html: `<html><body><section><h1>Foi feito uma tentativa de acesso com seu usuário</h1><h3>Por favor, confirme se foi você que tentou acessar</h3><a href='http://localhost:3000/ConfirmarUsuario?UserEmail=${user.email}&UserIp=${ipClient}&UserToken=${user.auth_token}'><input type='button' value='Autorizar'></a></section></body></html>`
                    }
                    
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            user.save()
                            console.log('Email sent: ' + info.response);
                        }
                    });

                    res.status(422).json({message: 'Uma mensagem foi enviada para o seu email cadastrado, confirme que é você que está tentando acessar as informações.'})
                }else{
                    const infos = await Information.find()
                    res.status(200).json(infos)
                }
            }else{
                res.status(400).json({error: 'Credenciais inválidas.'})
            }
        }        
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Erro ao buscar os dados"})
    } 
})




module.exports = router