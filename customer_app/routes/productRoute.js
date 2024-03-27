const express = require('express')

const productController = require('../controllers/productController')

const productRouter = express.Router()

productRouter.post('/addProduct/:userId', productController.addProduct)

module.exports = productRouter
