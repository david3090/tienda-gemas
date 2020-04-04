//Estas rutas algunas va a utilizar postman para el C-R-U-D y utilizando el verifyToken para la seguridad 
const router = require('express').Router()

let GemsController = require('../controllers/Gems')
const VerifyToken = require('../Middleware/VerifyToken')
const multipart = require('connect-multiparty')

router.get('/getGems', VerifyToken, GemsController.getGems)

router.post('/getGems', VerifyToken, GemsController.getGems)

router.post('/addGem', GemsController.createGem)

router.post('/getGemOne', VerifyToken,  GemsController.getGems)

router.post('/updateGem', VerifyToken, GemsController.updateGem)

router.post('/deleteGem', VerifyToken,  GemsController.deleteGem)

router.use(multipart({
    uploadDir: 'tmp'
}))
//Ruta para que se se puedan subir las fotos a cloudinary por medio de la ruta
router.post('/uploadPhoto', GemsController.uploadPhotos)


module.exports = router


