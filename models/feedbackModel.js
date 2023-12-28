const mongoose = require('mongoose')

const feedbackModel = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    rating: {
        type: Number,
        required: true,
    },
    feedback: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
})

feedbackModel.set('timestamps', true)

module.exports = mongoose.model('feedback', feedbackModel);
