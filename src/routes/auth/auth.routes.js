const express = require('express')
const router = express.Router()

const authController = require('../../controllers/auth/auth.controller')
const authMiddleware = require('../../middlewares/authMiddleware')

router.get('/signin', authMiddleware.isNotLoggedIn, authController.renderSignin)
router.get('/logout', authMiddleware.isLoggedIn, authController.logOut)
router.get('/signup', authMiddleware.isNotLoggedIn, authController.renderSignup)
router.get('/profile', authMiddleware.isLoggedIn, authController.renderProfile)

router.post('/signin', authController.signIn)
router.post('/signup', authController.signUp)
router.post('/profile/edit', authController.editProfile)

module.exports = router