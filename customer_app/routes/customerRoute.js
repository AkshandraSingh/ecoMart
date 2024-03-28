const express = require('express')

const customerController = require('../controllers/customerController')
const customerImageStorage = require('../../middleware/customerImageStorage')

const customerRouter = express.Router()

customerRouter.post('/signupCustomer', customerController.signupCustomer)
customerRouter.post('/loginCustomer', customerController.loginCustomer)
customerRouter.post('/forgetPassword', customerController.forgetPassword)
customerRouter.post('/resetPassword/:userId/:token', customerController.resetPassword)
customerRouter.post('/setNewPassword/:userId', customerController.setNewPassword)
customerRouter.post('/updateName/:userId', customerController.updateName)
customerRouter.post('/changeProfilePic/:userId', customerImageStorage.upload.single('customerProfilePic'), customerController.changeProfilePic)
customerRouter.post('/depositBalance/:userId', customerController.depositBalance)
customerRouter.post('/withdrawBalance/:userId', customerController.withdrawBalance)
customerRouter.get('/viewProfile/:userId', customerController.viewProfile)

module.exports = customerRouter
