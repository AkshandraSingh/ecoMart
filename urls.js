const express = require('express')

const customerRouter = require('./customer_app/routes/customerRoute')
const productRouter = require('./customer_app/routes/productRoute')
const categoryRouter = require('./admin_app/routes/categoryRoute')

const commonRouter = express.Router()

commonRouter.use('/customer', customerRouter)
commonRouter.use('/product', productRouter)
commonRouter.use('/category', categoryRouter)

module.exports = commonRouter
