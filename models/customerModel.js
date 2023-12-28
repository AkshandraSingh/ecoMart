const mongoose = require('mongoose')

const userModel = mongoose.Schema({
    customerName: {
        type: String,
        required: true,
        unique: true,
    },
    customerEmail: {
        type: String,
        required: true,
        unique: true,
    },
    customerPhone: {
        type: Number,
        required: true,
    },
    customerPassword: {
        type: String,
        required: true,
    },
    userRole: {
        type: String, // Customer or Seller
        default: "customer"
    },
    usedPasswords: {
        type: [],
        default: [],
    },
    cart: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            default: undefined,
        },
        quantity: {
            type: Number,
            default: undefined,
        },
    }],
    isActive: {
        type: Boolean,
        default: true,
    }
})

userModel.set('timestamps', true)

module.exports = userModel.model('user', userModel)
