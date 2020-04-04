//En esta parte se encuentran las costantes con las variables y las rutas de los diferentes paquetes ya instalados
const mongoose = require('mongoose')
const meteorID = require('meteor-mongo-id')
const Random = require('meteor-random')
const Schema = mongoose.Schema

//Este es el esquema de las reviews, y contiene Caracteristicas que contiene las reviews 
const ReviewSchema = Schema({
    stars: {
        type: Number,
        allowedValues:[5,4,3,2,1]
    },
    body:{
        type:String
    },
    author: {
        type: String
    },
    createdOn: {
        type: String
    }
})
//Este es el esquema de las caracteristicas de las gemas 
const SpecsSchema = Schema ({
    faces: { type: Number },
    color: { type: String },
    
    rarity: { 

    type: Number,
    allowedValues : [1,2,3,4,5,6,7,8,9,10] },
    
    shine: { 
    type: Number,
    allowedValues : [1,2,3,4,5,6,7,8,9,10] }
})
//Esta parte es el esquema que vamos a intruducir a la base de datos pasado por el postman 
const GemsSchema = Schema({
    _id:{
        type: String,
    },
    name : { type: String},
    description: { type: String},
    price : {type: Number},
    canPurchase: {type: Boolean},
    specs: { 
    type: SpecsSchema 
   },
   images:{
    type: [String],
    
   },

   
   reviews:{
     type:[ReviewSchema]
   }
   
          
 })
 
 


module.exports = mongoose.model('Gems', GemsSchema)
