const express = require('express')

const feedbackController = require('../controllers/feedbackController')

const feedbackRouter = express.Router()

feedbackRouter.post("/addFeedback/:userId", feedbackController.addFeedback)

module.exports = feedbackRouter;
