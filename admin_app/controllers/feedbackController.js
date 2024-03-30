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
}
