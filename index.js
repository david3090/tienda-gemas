//Esto nos permite conectarnos a la base de datos poniendo las "credenciales" de mongoDB 

'use strict'
const mongoose = require('mongoose')
const app = require('./app')
const port = process.env.PORT || 3000

const local = 'mongodb://localhost:27017/databasegems'
const uat = 'mongodb+srv://david_3090:<aqYGPVxw1MyUQUKi>@carsdatabase-cbumh.mongodb.net/test'

mongoose.connect(local, (err, res)=>{
    if(err){
        return console.log(`Error connecting to data base: ${err}`)
    }

    console.log('Database connection established')

    app.listen (port, ()=>{
        console.log(`API Rest running at http://localhost:${port}`)
    })
})
