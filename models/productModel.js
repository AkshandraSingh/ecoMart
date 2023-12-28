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
        default: 'defaultProductImage.png',
    },
    isActive: {
        type: Boolean,
        default: true,
    }
});

productModel.set('timestamps', true)

module.exports = mongoose.model('product', productModel);
