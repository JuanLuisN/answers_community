const express = require('express')
const router = express.Router()

const authMiddleware = require('../../middlewares/authMiddleware')
const questionsController = require('../../controllers/usersController/questions.controller')
const answersController = require('../../controllers/usersController/answers.controller')

router.get('/myquestions', authMiddleware.isLoggedIn, questionsController.renderQuestions)
router.post('/myquestions/add', authMiddleware.isLoggedIn, questionsController.saveQuestion)
router.post('/myquestions/edit/:id', authMiddleware.isLoggedIn, questionsController.editQuestion)
router.get('/myquestions/delete/:id', authMiddleware.isLoggedIn, questionsController.deleteQuestion)
router.get('/details-question=:id', questionsController.renderDetailsQuestion)

router.get('/myanswers', authMiddleware.isLoggedIn, answersController.renderAnswers)
router.post('/answer/add/:id', authMiddleware.isLoggedIn, answersController.saveAnswer)
router.post('/answer/edit/:id', authMiddleware.isLoggedIn, answersController.editAnswer)
router.get('/answer/delete/:id', authMiddleware.isLoggedIn, answersController.deleteAnswer)
router.get('/answer/addvote/:fk_answer/:fk_question', authMiddleware.isLoggedIn, answersController.addVote)
router.get('/answer/subtractvote/:fk_answer/:fk_question', authMiddleware.isLoggedIn, answersController.subtractVote)

module.exports = router