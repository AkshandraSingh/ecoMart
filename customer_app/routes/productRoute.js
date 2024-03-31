const express = require('express')

const productController = require('../controllers/productController')
const productImageStorage = require('../../middleware/productImageStorage')

const productRouter = express.Router()

productRouter.post('/addProduct/:userId', productController.addProduct)
productRouter.post('/addToCart/:customerId/:productId', productController.addToCart)
productRouter.post('/orderProduct/:customerId/:productId', productController.orderProduct)
productRouter.post('/orderAllProduct/:customerId', productController.orderAllProduct)
productRouter.get('/searchProduct/:productName', productController.searchProduct)
productRouter.get('/viewCart/:customerId', productController.viewCart)
productRouter.get('/emptyCart/:customerId', productController.emptyCart)
productRouter.get('/removeProductFromCart/:customerId/:productId', productController.removeProductFromCart)
productRouter.get('/decreaseQuantity/:customerId/:productId', productController.decreaseQuantity)
productRouter.get('/increaseQuantity/:customerId/:productId', productController.increaseQuantity)
productRouter.get('/billCart/:customerId', productController.billCart)
productRouter.get('/viewProduct/:productId', productController.viewProduct)
productRouter.patch('/editProduct/:productId', productImageStorage.upload.single('productImage'), productController.editProduct)
productRouter.delete('/deleteProduct/:productId', productController.deleteProduct)

module.exports = productRouter
