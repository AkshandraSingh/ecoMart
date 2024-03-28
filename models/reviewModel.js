const mongoose = require('mongoose')

const reviewModel = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: undefined,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        default: undefined,
    },
    rating: {
        type: Number,
        required: true,
    },
    aboutReview: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
})

reviewModel.set('timestamps', true)

module.exports = mongoose.model('review', reviewModel);
