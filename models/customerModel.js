const mongoose = require('mongoose')

const customerModel = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
    },
    customerEmail: {
        type: String,
        required: true,
        unique: true,
    },
    customerPhone: {
        type: String,
        required: true,
        unique: true,
    },
    customerPassword: {
        type: String,
        required: true,
    },
    customerGender: {
        type: String, // Male or Female
        required: true,
    },
    userRole: {
        type: String, // Customer or Seller
        default: "customer"
    },
    accountBalance: {
        type: Number,
        default: 0,
    },
    usedPasswords: {
        type: [],
        default: [],
    },
    customerProfilePic: {
        type: String,
        required: true,
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

customerModel.set('timestamps', true)

module.exports = mongoose.model('customer', customerModel)
