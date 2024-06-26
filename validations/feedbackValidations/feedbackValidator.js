const feedbackValidationSchema = require('./feedbackValSchema')

module.exports = {
    addFeedbackValidation: async (req, res, next) => {
        const value = await feedbackValidationSchema.addReview.validate(req.body, { abortEarly: false })
        if (value.error) {
            return res.status(403).json({
                success: false,
                message: value.error.details[0].message
            })
        } else {
            next()
        }
    },
}
