let router = require('express').Router()

let AuthController = require('../controllers/Auth')
const VerifyToken = require('../Middleware/VerifyToken')

router.post('/login', AuthController.LoginUser)
router.post('/logout', AuthController.LogoutUser)
router.get('/me', VerifyToken, AuthController.GetCurrentUser)
router.post('/signup', AuthController.signInUser)


module.exports = router