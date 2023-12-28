const express = require('express')

const customerRouter = require('./customer_app/routes/customerRoute')

const commonRouter = express.Router()

commonRouter.use('/customer', customerRouter)

module.exports = commonRouter
