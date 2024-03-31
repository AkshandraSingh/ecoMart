const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const customerModel = require('../../models/customerModel')
const emailService = require('../../services/emailService')
const customerLogger = require('../../utils/customerLogger/customerLogger')

module.exports = {
    //? Signup API For Customer 👀
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
                customerLogger.info("Account Created Successfully!")
                res.status(201).send({
                    success: true,
                    message: "Account is created successfully!"
                })
            } else {
                customerLogger.error("Email or Phone already exist")
                res.status(401).send({
                    success: false,
                    message: "Email or Phone already exist!"
                })
            }
        } catch (error) {
            customerLogger.error(`Server Error: ${error.message}`)
            res.status(500).send({
                success: true,
                message: "Server error!",
                error: error.message,
            })
        }
    },
    //? Login API For Customer 💫
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
                customerLogger.error("Customer not found")
                return res.status(404).send({
                    success: false,
                    message: "Customer not found "
                })
            }
            const customerData = isCustomerEmail || isCustomerPhone
            const isCorrectPassword = await bcrypt.compare(customerPassword, customerData.customerPassword)
            if (isCorrectPassword) {
                const token = jwt.sign({ customerData }, process.env.SECRET_KEY, { expiresIn: '1h' });
                customerLogger.info("Login successfully")
                return res.status(200).send({
                    success: true,
                    message: "Login successfully!",
                    token: token,
                })
            } else {
                customerLogger.error("User email/phone or password is incorrect")
                res.status(400).send({
                    success: false,
                    message: "User email/phone or password is incorrect"
                })
            }
        } catch (error) {
            customerLogger.error(`Server Error: ${error.message}`)
            res.status(500).send({
                success: true,
                message: "Server error!",
                error: error.message,
            })
        }
    },
    //? Forget Password API For Customer 🎯
    forgetPassword: async (req, res) => {
        try {
            const { customerEmail } = req.body
            const isEmailExist = await customerModel.findOne({
                customerEmail: customerEmail
            })
            if (!isEmailExist) {
                customerLogger.error("Customer not found!")
                return res.status(404).send({
                    success: false,
                    message: "Customer not found!"
                })
            }
            const token = jwt.sign({ isEmailExist }, process.env.SECRET_KEY, { expiresIn: '1h' });
            const resetPasswordLink = `https://ecoMart/customer/resetPassword/${isEmailExist._id}/${token}`
            await emailService.mailOptions(customerEmail, resetPasswordLink)
            customerLogger.info("Email has been sended successfully")
            res.status(200).send({
                success: true,
                message: "Email has been sended successfully",
                userId: isEmailExist._id,
                token: token,
            })
        } catch (error) {
            customerLogger.error(`Server Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message,
            })
        }
    },
    //? Reset Password API For Customer 🧠
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
                        customerLogger.error("Don't use old passwords, try another password")
                        return res.status(401).json({
                            success: false,
                            message: "Don't use old passwords, try another password",
                        });
                    }
                    const bcryptPassword = await bcrypt.hash(newPassword, 10)
                    customerData.customerPassword = bcryptPassword
                    customerData.usedPasswords.push(bcryptPassword)
                    await customerData.save();
                    customerLogger.info("Password Updated")
                    res.status(201).json({
                        success: true,
                        message: "Password Updated",
                    });
                } else {
                    customerLogger.error("New password or confirm password is incorrect")
                    res.status(401).send({
                        success: false,
                        message: "New password or confirm password is incorrect"
                    })
                }
            } else {
                customerLogger.error("Token is incorrect or expire")
                res.status(401).send({
                    success: false,
                    message: "Token is incorrect or expire"
                })
            }
        } catch (error) {
            customerLogger.error(`Server Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message,
            })
        }
    },
    //? Set New Password API For Customer 🦕
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
                        customerLogger.error("Don't use old passwords, try another password")
                        return res.status(401).json({
                            success: false,
                            message: "This password you already used in the past",
                        });
                    } else {
                        const bcryptPassword = await bcrypt.hash(newPassword, 10);
                        customerData.customerPassword = bcryptPassword;
                        customerData.usedPasswords.push(bcryptPassword);
                        await customerData.save();
                        customerLogger.info("Password Updated")
                        res.status(200).json({
                            success: true,
                            message: "Your Password is updated!",
                        });
                    }
                } else {
                    customerLogger.error("New password and Confirm password do not match")
                    res.status(401).json({
                        success: false,
                        message: "New password and Confirm password do not match",
                    });
                }
            } else {
                customerLogger.error("Old password is incorrect")
                res.status(401).json({
                    success: false,
                    message: "Old password is incorrect",
                });
            }
        } catch (error) {
            customerLogger.error(`Server Error: ${error.message}`)
            res.status(500).json({
                success: false,
                message: "Error",
                error: error.message,
            });
        }
    },
    //? View Profile API For Customer 🆒
    viewProfile: async (req, res) => {
        try {
            const { userId } = req.params
            const profileData = await customerModel.findById(userId).select("customerName customerGender userRole customerProfilePic customerEmail customerPhone customerAddress accountBalance cart")
            customerLogger.info("Successfully viewed profile")
            res.status(200).json({
                success: true,
                message: "Successfully Viewed Profile",
                profileData: profileData
            })
        } catch (error) {
            customerLogger.error(`Server Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message,
            })
        }
    },
    //? Update Name API For Customer 🧙
    editProfile: async (req, res) => {
        try {
            const { userId } = req.params
            const { customerName, customerAddress, userRole } = req.body
            const customerData = await customerModel.findByIdAndUpdate(userId, {
                customerName: customerName || undefined,
                customerAddress: customerAddress || undefined,
                userRole: userRole || undefined,
            })
            await customerData.save()
            customerLogger.info("Successfully Updated Name!")
            res.status(200).json({
                success: true,
                message: "Successfully Updated Name!",
            })
        } catch (error) {
            customerLogger.error(`Server Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message,
            })
        }
    },
    //? Change Profile Pic API For Customer 💀
    changeProfilePic: async (req, res) => {
        try {
            const { userId } = req.params
            const customerProfilePic = `/upload/profilePics/${req.file.filename}`
            const customerData = await customerModel.findById(userId)
            customerData.customerProfilePic = customerProfilePic
            await customerData.save()
            customerLogger.info("Successfully Updated Profile Pic!")
            res.status(200).send({
                success: true,
                message: "Successfully Updated Profile Pic!",
            })
        } catch (error) {
            customerLogger.error(`Server Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message,
            })
        }
    },

    //? Deposit Balance API For Customer 🧛
    depositBalance: async (req, res) => {
        try {
            const { userId } = req.params
            const { depositAmount } = req.body
            const customerData = await customerModel.findById(userId)
            customerData.accountBalance += depositAmount
            await customerData.save()
            customerLogger.info("Successfully Deposited Balance!")
            res.status(200).send({
                success: true,
                message: "Successfully Deposited Balance!",
                currentBalance: customerData.accountBalance,
            })
        } catch (error) {
            customerLogger.error(`Server Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message,
            })
        }
    },

    //? Withdraw Balance API For Customer 🧛
    withdrawBalance: async (req, res) => {
        try {
            const { userId } = req.params
            const { withdrawAmount } = req.body
            const customerData = await customerModel.findById(userId)
            customerData.accountBalance = customerData.accountBalance - withdrawAmount
            await customerData.save()
            customerLogger.info("Successfully Withdrawn Balance!")
            res.status(200).send({
                success: true,
                message: "Successfully Withdrawn Balance!",
                currentBalance: customerData.accountBalance,
            })
        } catch (error) {
            customerLogger.error(`Server Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message,
            })
        }
    },
}
