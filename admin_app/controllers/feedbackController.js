const feedbackModel = require("../../models/feedbackModel")
const userModel = require('../../models/customerModel')
const feedbackLogger = require("../../utils/feedbackLogger/feedbackLogger")

module.exports = {
    //? Add Feedback API for Customers/Sellers 👀
    addFeedback: async (req, res) => {
        try {
            const { userId } = req.params
            const feedbackData = new feedbackModel(req.body)
            if (feedbackData.rating > 5) {
                feedbackLogger.error("Please rate from 1 to 5")
                return res.status(401).send({
                    success: false,
                    message: "Please rate from 1 to 5",
                })
            }
            feedbackData.userId = userId
            await feedbackData.save()
            feedbackLogger.info("Feedback added successfully!")
            res.status(201).send({
                success: true,
                message: "Feedback added successfully!",
            })
        } catch (error) {
            feedbackLogger.error(`Server Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message,
            })
        }
    },

    //? update Feedback API for Customers/Sellers ✨
    updateFeedback: async (req, res) => {
        try {
            const { feedbackId } = req.params
            if (req.body.rating > 5) {
                feedbackLogger.error("Please rate from 1 to 5")
                return res.status(401).send({
                    success: false,
                    message: "Please rate from 1 to 5",
                })
            }
            const feedbackData = await feedbackModel.findByIdAndUpdate(feedbackId, {
                feedback: req.body.feedback || undefined,
                rating: req.body.rating || undefined,
            })
            feedbackLogger.info("Feedback updated successfully!")
            res.status(200).send({
                success: true,
                message: "Feedback updated successfully!",
            })
        } catch (error) {
            feedbackLogger.error(`Server Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message,
            })
        }
    },

    //? Delete Feedback API for Customers/Sellers 🧠
    deleteFeedback: async (req, res) => {
        try {
            const { feedbackId } = req.params
            await feedbackModel.findByIdAndDelete(feedbackId)
            feedbackLogger.info("Feedback deleted successfully!")
            res.status(200).send({
                success: true,
                message: "Feedback deleted successfully!",
            })
        } catch (error) {
            feedbackLogger.error(`Server Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message,
            })
        }
    },

    //? View Feedback API for Admin 🧠
    viewFeedback: async (req, res) => {
        try {
            const { userId } = req.params
            const userData = await userModel.findById(userId)
            if (userData.userRole !== "admin") {
                feedbackLogger.error("You are not authorized to view feedback!")
                return res.status(401).send({
                    success: false,
                    message: "You are not authorized to view feedback!",
                })
            }
            const feedbackData = await feedbackModel.find()
            feedbackLogger.info("Feedback fetched successfully!")
            res.status(200).send({
                success: true,
                message: "Feedback fetched successfully!",
                feedbackData: feedbackData
            })
        } catch (error) {
            feedbackLogger.error(`Server Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message,
            })
        }
    },
}
