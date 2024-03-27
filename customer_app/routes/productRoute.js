const express = require('express')

const productController = require('../controllers/productController')
const productImageStorage = require('../../middleware/productImageStorage')

const productRouter = express.Router()

productRouter.post('/addProduct/:userId', productController.addProduct)
productRouter.patch('/editProduct/:productId', productImageStorage.upload.single('productImage'), productController.editProduct)
productRouter.delete('/deleteProduct/:productId', productController.deleteProduct)

module.exports = productRouter
