//Es la variable que sube los modulos para exportar 
module.exports = {
    LoginUser,
    LogoutUser,
    GetCurrentUser,
    signInUser
}
//estas son las constantes que van a utilizar las funciones 
const User = require('../models/User')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const sha256 = require('sha256')
const verifyToken = require('../Middleware/VerifyToken')
//Esta funcion permite iniciar seccion con un usuario ya creado
function LoginUser(req, res){
      User.findOne({username: req.body.username}).then((user)=>{
          if(!user) return res.status(404).send('No server found')

          let passwordIsvalid = bcrypt.compareSync (req.body.password,user.password)
    
          if(!passwordIsvalid) return res.status(401).send({auth: false, message: 'Error password', token: null})
          
     //con el let token hace que se autentifiquen los usuarios
          let token = jwt.sign({id: user.id}, process.env.JWT_SECRET,{
              expiresIn: 864000
          })
          res.status(200).send({auth: true, token: token, username: user.toObject().username})
      })
      .catch((err)=>{
console.log("Error on catch", err)
res.status(500).send({message: 'Error on server', error: err})
      })
}

function LogoutUser(req, res){
    res.status(200).send({auth: false, token: null});

}

function GetCurrentUser(req, res){
    let token = req.headers['x-access-token']
    if(!token) return res.status(401).send({auth: false, message: 'No token provided'})
    verifyToken(token)
    .then((decode)=> User.findOne({id: decoded.id}))
    .then((user)=>{
        if(!user) return res.status(401).send({auth: false, message: 'No user found' })
        res.status(200).send(user)
    })
    .catch((err)=> res.status(500).send({err}))
}
//Con esta funcion permite crear un usuario 
function signInUser(req,res){
   const user = new User ({
     email: req.body.email,
     username: req.body.username,
     password: bcrypt.hashSync(req.body.password,
        10),
        phone: req.body.phone,
        roles: req.body.roles 
   })

   
   user.save((err)=>{
       let token = jwt.sign({id: user.id}, process.env. JWT_SECRET,{expiresIn: 86400})

       if(err) return res.status(500).send ({message: `problem creating new user ${err}`})

       return res.status(201).send({token: token, message: 'user Created'})
     })
}
