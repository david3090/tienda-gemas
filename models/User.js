//En esta parte se encuentran las costantes con las variables y las rutas de los diferentes paquetes ya instalados
const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Este es el esquema donde contiene como se debe de registrar el usuario
const UserProfileSchema = Schema({
    username: {
        type: String
    },
    phone: {
        type: String,
        optional: true,
    },
    email:{
        type: String
    },
    roles: {
        type: {String},
        allowedValues: ['admin', 'manager', 'developer']
    },
    password:{
        type: String
    }
})

module.exports = mongoose.model('Users', UserProfileSchema)

