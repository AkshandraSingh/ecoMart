const express = require('express')

const feedbackController = require('../controllers/feedbackController')

const feedbackRouter = express.Router()

feedbackRouter.post("/addFeedback/:userId", feedbackController.addFeedback)
feedbackRouter.patch("/updateFeedback/:feedbackId", feedbackController.updateFeedback)
feedbackRouter.delete("/deleteFeedback/:feedbackId", feedbackController.deleteFeedback)
feedbackRouter.get("/viewFeedback/:userId", feedbackController.viewFeedback)

module.exports = feedbackRouter;
