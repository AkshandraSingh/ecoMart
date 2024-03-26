const express = require('express')

const customerController = require('../controllers/customerController')

const customerRouter = express.Router()

customerRouter.post('/signupCustomer', customerController.signupCustomer)
customerRouter.post('/loginCustomer', customerController.loginCustomer)
customerRouter.post('/forgetPassword', customerController.forgetPassword)
customerRouter.post('/resetPassword/:userId/:token', customerController.resetPassword)

module.exports = customerRouter
