const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const customerModel = require('../../models/customerModel')
const emailService = require('../../services/emailService')

module.exports = {
    signupCustomer: async (req, res) => {
        try {
            const customerData = new customerModel(req.body)
            const isEmailExist = await customerModel.findOne({
                customerEmail: req.body.customerEmail
            })
            const isPhoneExist = await customerModel.findOne({
                customerPhone: req.body.customerPhone
            })
            if (!isEmailExist && !isPhoneExist) {
                const bcryptPassword = await bcrypt.hash(req.body.customerPassword, 10)
                customerData.customerPassword = bcryptPassword
                customerData.customerProfilePic = (customerData.customerGender === 'male') ?
                    'F:/Node Projects/EcoMart/images/avatars/maleAvatar.png' :
                    'F:/Node Projects/EcoMart/images/avatars/femaleAvatar.jpg';
                customerData.usedPasswords.push(bcryptPassword)
                await customerData.save()
                res.status(201).send({
                    success: true,
                    message: "Account is created successfully!"
                })
            } else {
                res.status(401).send({
                    success: false,
                    message: "Email or Phone already exist!"
                })
            }
        } catch (error) {
            res.status(500).send({
                success: true,
                message: "Server error!",
                error: error.message,
            })
        }
    },
    loginCustomer: async (req, res) => {
        try {
            const { customerAccount, customerPassword } = req.body
            const isCustomerEmail = await customerModel.findOne({
                customerEmail: customerAccount
            })
            const isCustomerPhone = await customerModel.findOne({
                customerPhone: customerAccount
            })
            if (!isCustomerEmail && !isCustomerPhone) {
                return res.status(404).send({
                    success: false,
                    message: "Customer not found "
                })
            }
            const customerData = isCustomerEmail || isCustomerPhone
            const isCorrectPassword = await bcrypt.compare(customerPassword, customerData.customerPassword)
            if (isCorrectPassword) {
                const token = jwt.sign({ customerData }, process.env.SECRET_KEY, { expiresIn: '1h' });
                return res.status(200).send({
                    success: true,
                    message: "Login successfully!",
                    token: token,
                })
            } else {
                res.status(400).send({
                    success: false,
                    message: "User email/phone or password is incorrect"
                })
            }
        } catch (error) {
            res.status(500).send({
                success: true,
                message: "Server error!",
                error: error.message,
            })
        }
    },
    forgetPassword: async (req, res) => {
        try {
            const { customerEmail } = req.body
            const isEmailExist = await customerModel.findOne({
                customerEmail: customerEmail
            })
            if (!isEmailExist) {
                return res.status(404).send({
                    success: false,
                    message: "Customer not found!"
                })
            }
            const token = jwt.sign({ isEmailExist }, process.env.SECRET_KEY, { expiresIn: '1h' });
            const resetPasswordLink = `https://ecoMart/customer/resetPassword/${isEmailExist._id}/${token}`
            await emailService.mailOptions(customerEmail, resetPasswordLink)
            res.status(200).send({
                success: true,
                message: "Email has been sended successfully",
                userId: isEmailExist._id,
                token: token,
            })
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message,
            })
        }
    },
}
