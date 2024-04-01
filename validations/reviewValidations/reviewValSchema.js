const joi = require('joi');

const reviewValSchema = {
    addReview: joi.object({
        aboutReview: joi
            .string()
            .max(220)
            .min(10)
            .message({
                "string-min": "{#label} should be at least {#limit} characters",
                "string-max": "{#label} should be at most {#limit} characters",
            })
            .required(),
        rating: joi
            .number()
            .required(),

    }).unknown(true),
};

module.exports = reviewValSchema;
