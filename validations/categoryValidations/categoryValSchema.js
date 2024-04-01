const joi = require('joi');

const categoryValSchema = {
    addCategory: joi.object({
        categoryName: joi
            .string()
            .max(20)
            .min(3)
            .message({
                "string-min": "{#label} should be at least {#limit} characters",
                "string-max": "{#label} should be at most {#limit} characters",
            })
            .required(),

    }).unknown(true),
};

module.exports = categoryValSchema
