const express = require('express')

const customerRouter = require('./customer_app/routes/customerRoute')
const productRouter = require('./customer_app/routes/productRoute')
const reviewRouter = require("./customer_app/routes/reviewRoute")
const categoryRouter = require('./admin_app/routes/categoryRoute')
const feedbackRouter = require('./admin_app/routes/feedbackRoute')

const commonRouter = express.Router()

commonRouter.use('/customer', customerRouter)
commonRouter.use('/product', productRouter)
commonRouter.use('/category', categoryRouter)
commonRouter.use('/feedback', feedbackRouter)
commonRouter.use('/review', reviewRouter)

module.exports = commonRouter
