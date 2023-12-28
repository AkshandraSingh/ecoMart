const bcrypt = require('bcrypt')

const customerModel = require('../../models/customerModel')

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
    }
}
