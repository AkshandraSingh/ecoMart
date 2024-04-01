const joi = require('joi');

const productValSchema = {
    addProduct: joi.object({
        productName: joi
            .string()
            .max(20)
            .min(3)
            .message({
                "string-min": "{#label} should be at least {#limit} characters",
                "string-max": "{#label} should be at most {#limit} characters",
            })
            .required(),
        productDescription: joi
            .string()
            .max(220)
            .min(10)
            .message({
                "string-min": "{#label} should be at least {#limit} characters",
                "string-max": "{#label} should be at most {#limit} characters",
            })
            .required(),
        productPrice: joi
            .number()
            .required(),
        productCategory: joi
            .string()
            .required(),
        productStock: joi
            .number()
            .required(),
        productImage: joi
            .string()
            .required(),

    }).unknown(true),

    addToCart: joi.object({
        quantity: joi
            .number()
            .required(),
    }).unknown(true),

    orderProduct: joi.object({
        paymentMode: joi
            .string()
            .required(),
        quantity: joi
            .number()
            .required(),
    }),

    orderAllProduct: joi.object({
        paymentMode: joi
            .string()
            .required(),
    }),
};

module.exports = productValSchema;
