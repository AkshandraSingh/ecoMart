const express = require('express')

const customerController = require('../controllers/customerController')
const customerImageStorage = require('../../middleware/customerImageStorage')
const customerValidator = require("../../validations/customerValidations/customerValidator")

const customerRouter = express.Router()

customerRouter.post('/signupCustomer', customerValidator.customerSignupValidation, customerController.signupCustomer)
customerRouter.post('/loginCustomer', customerValidator.loginCustomerValidation, customerController.loginCustomer)
customerRouter.post('/forgetPassword', customerController.forgetPassword)
customerRouter.post('/resetPassword/:userId/:token', customerValidator.resetPasswordValidation, customerController.resetPassword)
customerRouter.post('/setNewPassword/:userId', customerValidator.setNewPasswordValidation, customerController.setNewPassword)
customerRouter.patch('/editProfile/:userId', customerController.editProfile)
customerRouter.post('/changeProfilePic/:userId', customerImageStorage.upload.single('customerProfilePic'), customerController.changeProfilePic)
customerRouter.post('/depositBalance/:userId', customerValidator.depositBalanceValidation, customerController.depositBalance)
customerRouter.post('/withdrawBalance/:userId', customerValidator.withdrawBalanceValidation, customerController.withdrawBalance)
customerRouter.get('/viewProfile/:userId', customerController.viewProfile)

module.exports = customerRouter
