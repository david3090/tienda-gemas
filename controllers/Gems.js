//Es la variable en donde se encuentran los modulos para exportarlos 
module.exports = {
    getGems,
    getGemOne,
    createGem,
    getGemsPagination,
    updateGem,
    deleteGem,
    uploadPhotos,
    updateGemWithImages,
    
}
//En esta parte se encuentran las costantes con las variables y las rutas de los diferentes paquetes ya instalados
const GemsSub = require('../models/gems')
const mongoose = require('mongoose')
const meteorID = require('meteor-mongo-id')
const Random = require('meteor-random')
const cloudinary = require('cloudinary').v2
const fs = require('fs')
//Aqui es donde configuramos las credenciales del cloudinary para poder subir las imagenes 
cloudinary.config({
    
})
//Esta funcion va a traer una gema usando el request y el result y usando un if para mostrar errores si los hay
function getGems(req, res){
   GemsSub.find({}, (err, concepts)=>{
if (err) return res .status(500).send({message: 'problem with the searching request ${err}'})
if(!concepts) return res.status(404).send({message: ' Gems does no exist'})
res.status(200).send({gems: concepts})
   })
}

function getGemsPagination(req, res){
    let perPage = parseInt(req.body.perPage)
    let page = parseInt(rec.body.page)
    let gemsConceptsRes = null;

    let searchData = req.query.search

    GemsSub.find(searchData).skip((page - 1 ) * perPage)
    .limit(perPage)
    .sort({})
    .exec()
    .then((concepts)=>{
    res.set('X-limit', perPage)
    res.set('X-page', page)
    gemsConceptsRes = concepts
    console.info("result", concepts)
    return GemsSub.count()
    })
    .then((total)=>{
       res.set('X-total', total)
       res.status(200).send({total: total, gemsTotal: gemsConceptsRes.length, gemsconcepts: gemsConceptsRes})
    })
    .catch((err)=>{
       console.log(err);
       res.status(500).send({message: `error in request ${err}`})
    })
    
}
function getGemOne(req, res){
   let concetpID = req.body.id
   GemsSub.find({_id: concetpID}, (err, concept)=>{
      if (err) return res .status(500).send({message: `problem with the searching request ${err}`})
      if(!concept) return res.status(404).send({message: ' Gem does no exist'})
      
      res.status(200).send({Gem: concept})
         })
 }
    //Esta funcion es para la creacion de gemas usado el req,res 
 function createGem(req, res) {
   let gem = req.body
   console.log(req.body)
   //usando la constante gemToCreate va a mostrar lo que esta dentro de la variable g
   let g = {

       _id: Random.id(), //Aqui nos va a dar una id aleatoria 

       name: gem.name, //Aqui va el nombre de la gema
       description: gem.description, //Aqui una breve descripcion           
       price: gem.price,  // El precio de la gema
       canPurchase: gem.canPurchase, //Es que si se pueden comprar en este caso va hacer que si porque 
                                    //estamos creando la gema

       specs: { //En esta parte del codigo se van especificar las cararacteristicas de la gema
           faces: gem.specs.faces,//Las aristas de la gema
           color: gem.specs.color,//El color de la gema
           rarity: gem.specs.rarity,//La rareza de la gema 
           shine: gem.specs.shine // El brillo de la gema
       },

       reviews: [{ //con el objeto reviews que contendra lo siguiente
           stars: gem.reviews.stars,//La calificacion de la gema 
           body: gem.reviews.body,// El texto donde va a ir la reviews
           author: gem.reviews.author,// persona que hace la reviews
           createdOn: formatDateName(new Date())
       }]

   }
    //Esta constante va hacer que la variable g muestre un error o algo que llege a fallar o no fallar al momento de hacer el request
   const gemToCreate = new GemsSub(g)

   gemToCreate.save((err, gemStored) => {
       if (err) return res.status(400).send({ message: `Error on model ${err}` })

       res.status(200).send({ gem: gemStored })
   })
}


 function updateGem(req, res){
   let conceptID = req.body._id
   let update = req.body.gem

 

 /* GemsSub.findOne({_id: conceptID}, (err, conceptCar)=>{
       if(err) return res.status(500).send({message: `Problem with the searching request ${err}`})
       if(!conceptCar) return res.status(404).send({message: 'The car does not exist'})
  })*/

   GemsSub.findByIdAndUpdate(conceptID, update, (err, concept)=>{
       if(err) return res.status(500).send({message: `Problem with the searching request ${err}`})
       res.status(200).send({message: `Update Successfull`, gem: concept})    
   })

 }
 //Funcion que por medio del _id del objeto, se vea en la base de datos Robo, y asi actualizarla 
 function updateGemWithImages(_id, img) {
   let conceptID = _id
   let update = img

   GemsSub.findByIdAndUpdate(conceptID,
       { "$push": { "images": update } },
       { "new": false, "upsert": false },
       (err, conceptUpdate) => {
           if (err) return res.status(500).send({ message: `Error in the request ${err}` })
           console.log("Gem update", conceptUpdate)
       })


}
//Esta funcion es para borrar un dato 
 function deleteGem(req, res){
   const conceptID = req.body._id

   GemsSub.remove({_id: conceptID}, (err,concept)=>{
      if(err) return res.status(500).send({message: `Problem with the searching request ${err}`})
      res.status(200).send({message: `Remove completed`})
   })
   
 }
 //Funcion que nos va a permitir subir las imagenes a cloudinary
 //Y con eso tambien va a meter un id con la imagen en la base de datos 
 function uploadPhotos(req, res) {

   const path = req.files.file.path
   const gemID = req.body._id
   console.log(typeof path)
   const uniqueFilename = Random.id()
   fs.readFile(path, function (err, data) {
       if (err) { throw err }
       cloudinary.uploader.upload(path, { public_id: `gemsImages/${uniqueFilename}`, 
       tags: `gemsImages`},
       (err, result)=> {
               console.log(result);
            let routeImg = result.url
            let arrayRoute = routeImg.split("/")
            let finalUrl = arrayRoute[6] + "/" + arrayRoute[7] + "/" + arrayRoute[8]

           if(err) return res.status(500).send(err)
           fs.unlinkSync(path)
           updateGemWithImages(gemID, finalUrl)
           res.status(200).send({message: "upload image sucess",
           imageData: result})
       
       })
   })

}
//Esta funcion sirve para la fecha completa: mes,dia,año,horas,minutos, y segundos y los va a mostrar
//Esto lo va a mostrar en el reviews 
function formatDateName(now) {
   let year = now.getFullYear()
   let month = now.getMonth() < 9 ? `0${now.getMonth() + 1}` : now.getMonth() + 1
   let day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate()
   let hours = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours()
   let minutes = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes()
   let seconds = now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds()

   return `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`

 }