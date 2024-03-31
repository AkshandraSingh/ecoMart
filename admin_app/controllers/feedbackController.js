const feedbackModel = require("../../models/feedbackModel")

module.exports = {
    //? Add Feedback API for Customers/Sellers 👀
    addFeedback: async (req, res) => {
        try {
            const { userId } = req.params
            const feedbackData = new feedbackModel(req.body)
            if (feedbackData.rating > 5) {
                return res.status(401).send({
                    success: false,
                    message: "Please rate from 1 to 5",
                })
            }
            feedbackData.userId = userId
            await feedbackData.save()
            res.status(201).send({
                success: true,
                message: "Feedback added successfully!",
            })
        } catch (error) {
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
                return res.status(401).send({
                    success: false,
                    message: "Please rate from 1 to 5",
                })
            }
            const feedbackData = await feedbackModel.findByIdAndUpdate(feedbackId, {
                feedback: req.body.feedback || undefined,
                rating: req.body.rating || undefined,
            })
            res.status(200).send({
                success: true,
                message: "Feedback updated successfully!",
            })
        } catch (error) {
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
            res.status(200).send({
                success: true,
                message: "Feedback deleted successfully!",
            })
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message,
            })
        }
    },
}
