const express = require('express')

const customerRouter = require('./customer_app/routes/customerRoute')
const categoryRouter = require('./admin_app/routes/categoryRoute')

const commonRouter = express.Router()

commonRouter.use('/customer', customerRouter)
commonRouter.use('/category', categoryRouter)

module.exports = commonRouter
