const express = require('express')

const customerController = require('../controllers/customerController')

const customerRouter = express.Router()

customerRouter.post('/signupCustomer', customerController.signupCustomer)

module.exports = customerRouter
