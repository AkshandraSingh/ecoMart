const express = require("express")

const reviewController = require("../controllers/reviewController")
const reviewValidator = require("../../validations/reviewValidations/reviewValidator")

const reviewRouter = express.Router()

reviewRouter.post("/addReview/:userId/:productId", reviewValidator.addReviewValidation, reviewController.addReview)
reviewRouter.patch("/updateReview/:reviewId", reviewController.updateReview)
reviewRouter.delete("/deleteReview/:reviewId", reviewController.deleteReview)

module.exports = reviewRouter;
