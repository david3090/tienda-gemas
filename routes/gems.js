const router = require('express').Router()

let GemsController = require('../controllers/Gems')
const VerifyToken = require('../Middleware/VerifyToken')
const multipart = require('connect-multiparty')

router.get('/getGems', VerifyToken, GemsController.getGems)

router.post('/getGems', VerifyToken, GemsController.getGems)

router.post('/addGem', GemsController.getGems)

router.post('/getGemOne', VerifyToken,  GemsController.getGems)

router.post('/updateGem', VerifyToken, GemsController.getGems)

router.post('/deleteGem', VerifyToken,  GemsController.getGems)

router.use(multipart({
    uploadDir: 'tmp'
}))

router.post('/uploadPhoto', GemsController.uploadPhotos)


module.exports = router


