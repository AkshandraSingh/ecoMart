const mongoose = require('mongoose');

const productModel = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    productDescription: {
        type: String,
        required: true,
    },
    productPrice: {
        type: Number,
        required: true,
    },
    productCategory: {
        type: String,
        required: true,
    },
    productStock: {
        type: Number,
        default: 0,
    },
    productImage: {
        type: String,
        default: 'D:/Node Projects/EcoMart/uploads/productsImages/defaultProductImage.png',
    },
    timesProductSold: {
        type: Number,
        default: 0,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
});

productModel.set('timestamps', true)

module.exports = mongoose.model('product', productModel);
