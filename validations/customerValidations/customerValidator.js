const customerValidationSchema = require('./customerValSchema')

module.exports = {
    customerSignupValidation: async (req, res, next) => {
        const value = await customerValidationSchema.signupCustomer.validate(req.body, { abortEarly: false })
        if (value.error) {
            return res.status(403).json({
                success: false,
                message: value.error.details[0].message
            })
        } else {
            next()
        }
    },

    loginCustomerValidation: async (req, res, next) => {
        const value = await customerValidationSchema.loginCustomer.validate(req.body, { abortEarly: false })
        if (value.error) {
            return res.status(403).json({
                success: false,
                message: value.error.details[0].message
            })
        } else {
            next()
        }
    },

    resetPasswordValidation: async (req, res, next) => {
        const value = await customerValidationSchema.resetPassword.validate(req.body, { abortEarly: false })
        if (value.error) {
            return res.status(403).json({
                success: false,
                message: value.error.details[0].message
            })
        } else {
            next()
        }
    },

    setNewPasswordValidation: async (req, res, next) => {
        const value = await customerValidationSchema.setNewPassword.validate(req.body, { abortEarly: false })
        if (value.error) {
            return res.status(403).json({
                success: false,
                message: value.error.details[0].message
            })
        } else {
            next()
        }
    },

    depositBalanceValidation: async (req, res, next) => {
        const value = await customerValidationSchema.depositBalance.validate(req.body, { abortEarly: false })
        if (value.error) {
            return res.status(403).json({
                success: false,
                message: value.error.details[0].message
            })
        } else {
            next()
        }
    },

    withdrawBalanceValidation: async (req, res, next) => {
        const value = await customerValidationSchema.withdrawBalance.validate(req.body, { abortEarly: false })
        if (value.error) {
            return res.status(403).json({
                success: false,
                message: value.error.details[0].message
            })
        } else {
            next()
        }
    },
}
