const express = require('express')
const router = express.Router()

const questionsController = require('../../controllers/usersController/questions.controller')
const authMiddleware = require('../../middlewares/authMiddleware')

router.get('/myquestions', authMiddleware.isLoggedIn, questionsController.renderQuestions)
router.post('/myquestions/add', authMiddleware.isLoggedIn, questionsController.saveQuestion)
router.post('/myquestions/edit/:id', authMiddleware.isLoggedIn, questionsController.editQuestion)
router.get('/myquestions/delete/:id', authMiddleware.isLoggedIn, questionsController.deleteQuestion)
router.get('/details-question=:id', questionsController.renderDetailsQuestion)

module.exports = router