const router =  require('express').Router()
var nodemailer = require("nodemailer")

const Adresses = require('../models/Adresses')
const Information = require('../models/Information')
const User = require('../models/User')

router.post('/', async(req,res) => {
    const {username,password,token} = req.body
    if(!username || !password || !token){
        res.status(422).json({error: 'Não informado todas as credenciais necessárias.'})
    }
    const user = {
        username,password,token
    }
})

router.get('/', async(req,res) => {
    try{
        const ipClient = req.connection.remoteAddress
        const {username,password,token} = req.body
        
        if(!username || !password || !token){
            res.status(422).json({error: 'Não informado todas as credenciais necessárias.'})
        }



        const user = await User.findOne({username:username})
        if(!user){
            res.status(422).json({error: 'Usuário não encontrado.'})
        }
        if(user.password != password){
            res.status(422).json({error: 'Credenciais inválidas.'})
        }

        const adress = await Adresses.findOne({ip_adress: ipClient})
        if(!adress){
            const remetente = nodemailer.createTransport({
                host: '',
                service: '',
                port:587,
                secure:true,
                auth:{
                    user: process.env.EMAIL_FROM,
                    pass: process.env.EMAIL_PASS
                }
            })
            var email = {
                from: process.env.EMAIL_FROM,
                to: user.Email,
                subject: 'Liberar Acesso',
                text: "<html><body><section><h1>Foi feito uma tentativa de acesso com seu usuário</h1><h3>Por favor, confirme se foi você que tentou acessar</h3><a href='localhost:3500/ConfirmarUsuario?IdUser=123&auth=true'>Sim, sou eu!</a> &nbsp; <a href='localhost:3500/ConfirmarUsuario?IdUser=123&auth=false'>Não, não foi eu!</a></section></body></html>"
            }
            res.status(422).json({message: 'Uma mensagem foi enviada para o seu email cadastrado, confirme que é você que está tentando acessar as informações.'})
        }else{
            const infos = await Information.find()
            res.status(200).json(infos)
        }

    }catch(error){
        res.status(500).json({error: error})
    } 
})




module.exports = router