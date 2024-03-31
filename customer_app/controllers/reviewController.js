const reviewModel = require('../../models/reviewModel')
const reviewLogger = require("../../utils/reviewLogger/reviewLogger")

module.exports = {
    addReview: async (req, res) => {
        try {
            const { userId, productId } = req.params
            const reviewData = new reviewModel(req.body)
            if (reviewData.rating > 5) {
                reviewLogger.error("Please rate from 1 to 5")
                return res.status(401).send({
                    success: false,
                    message: "Please rate from 1 to 5",
                })
            }
            reviewData.userId = userId
            reviewData.productId = productId
            await reviewData.save()
            reviewLogger.info("Review added successfully!")
            res.status(201).send({
                success: true,
                message: "Review added successfully!",
            })
        } catch (error) {
            reviewLogger.error(`Server Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message
            })
        }
    },

    updateReview: async (req, res) => {
        try {
            const { reviewId } = req.params
            if (req.body.rating > 5) {
                reviewLogger.error("Please rate from 1 to 5")
                return res.status(401).send({
                    success: false,
                    message: "Please rate from 1 to 5",
                })
            }
            const updatedReview = await reviewModel.findByIdAndUpdate(reviewId, {
                review: req.body.review || undefined,
                rating: req.body.rating || undefined,
            })
            reviewLogger.info("Review updated successfully!")
            res.status(200).send({
                success: true,
                message: "Review updated successfully!",
            })
        } catch (error) {
            reviewLogger.error(`Server Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message
            })
        }
    }
}
