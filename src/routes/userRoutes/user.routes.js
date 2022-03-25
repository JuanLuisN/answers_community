const express = require('express')
const router = express.Router()

const questionsController = require('../../controllers/usersController/questions.controller')
const authMiddleware = require('../../middlewares/authMiddleware')

router.get('/myquestions', authMiddleware.isLoggedIn, questionsController.renderQuestions)

module.exports = router