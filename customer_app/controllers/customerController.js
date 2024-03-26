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
                    'F:/Node Projects/EcoMart/uploads/avatars/maleAvatar.png' :
                    'F:/Node Projects/EcoMart/uploads/avatars/femaleAvatar.jpg';
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
    resetPassword: async (req, res) => {
        let isPasswordExist = false
        try {
            const { newPassword, confirmPassword } = req.body
            const { userId, token } = req.params
            const isTokenCorrect = jwt.verify(token, process.env.SECRET_KEY);
            if (isTokenCorrect) {
                if (newPassword === confirmPassword) {
                    const customerData = await customerModel.findById(userId)
                    for (const oldPassword of customerData.usedPasswords) {
                        if (await bcrypt.compare(newPassword, oldPassword)) {
                            isPasswordExist = true;
                            break;
                        }
                    }
                    if (isPasswordExist) {
                        return res.status(401).json({
                            success: false,
                            message: "Don't use old passwords, try another password",
                        });
                    }
                    const bcryptPassword = await bcrypt.hash(newPassword, 10)
                    customerData.customerPassword = bcryptPassword
                    customerData.usedPasswords.push(bcryptPassword)
                    await customerData.save();
                    res.status(201).json({
                        success: true,
                        message: "Password Updated",
                    });
                } else {
                    res.status(401).send({
                        success: false,
                        message: "New password or confirm password is incorrect"
                    })
                }
            } else {
                res.status(401).send({
                    success: false,
                    message: "Token is incorrect or expire"
                })
            }
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message,
            })
        }
    },

    setNewPassword: async (req, res) => {
        try {
            let isPasswordExist = false;
            const { userId } = req.params;
            const { oldPassword, newPassword, confirmPassword } = req.body;
            const customerData = await customerModel.findById(userId);
            const checkPassword = await bcrypt.compare(oldPassword, customerData.customerPassword);
            if (checkPassword) {
                if (confirmPassword === newPassword) {
                    for (const usedPassword of customerData.usedPasswords) {
                        if (await bcrypt.compare(newPassword, usedPassword)) {
                            isPasswordExist = true;
                            break;
                        }
                    }
                    if (isPasswordExist) {
                        return res.status(401).json({
                            success: false,
                            message: "This password you already used in the past",
                        });
                    } else {
                        const bcryptPassword = await bcrypt.hash(newPassword, 10);
                        customerData.customerPassword = bcryptPassword;
                        customerData.usedPasswords.push(bcryptPassword);
                        await customerData.save();
                        res.status(200).json({
                            success: true,
                            message: "Your Password is updated!",
                        });
                    }
                } else {
                    res.status(401).json({
                        success: false,
                        message: "New password and Confirm password do not match",
                    });
                }
            } else {
                res.status(401).json({
                    success: false,
                    message: "Old password is incorrect",
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error",
                error: error.message,
            });
        }
    },
}
