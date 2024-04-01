const productValidationSchema = require('./productValSchema')

module.exports = {
    addProductValidation: async (req, res, next) => {
        const value = await productValidationSchema.addProduct.validate(req.body, { abortEarly: false })
        if (value.error) {
            return res.status(403).json({
                success: false,
                message: value.error.details[0].message
            })
        } else {
            next()
        }
    },

    addToCartValidation: async (req, res, next) => {
        const value = await productValidationSchema.addToCart.validate(req.body, { abortEarly: false })
        if (value.error) {
            return res.status(403).json({
                success: false,
                message: value.error.details[0].message
            })
        } else {
            next()
        }
    },

    orderProductValidation: async (req, res, next) => {
        const value = await productValidationSchema.orderProduct.validate(req.body, { abortEarly: false })
        if (value.error) {
            return res.status(403).json({
                success: false,
                message: value.error.details[0].message
            })
        } else {
            next()
        }
    },

    orderAllProductValidation: async (req, res, next) => {
        const value = await productValidationSchema.orderAllProduct.validate(req.body, { abortEarly: false })
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
