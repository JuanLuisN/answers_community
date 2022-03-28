const express = require('express');
const router = express.Router()

const landingPageController = require('../controllers/landingPage.controller')

router.get('/', landingPageController.renderLandingPage)
router.get('/questions=:category', landingPageController.renderLandingPageByCategory)
router.post('/', landingPageController.searchQuestion)

module.exports = router