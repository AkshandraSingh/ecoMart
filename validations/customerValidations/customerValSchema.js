const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

const userValSchema = {
    signupCustomer: joi.object({
        customerName: joi
            .string()
            .max(20)
            .min(3)
            .message({
                "string-min": "{#label} should be at least {#limit} characters",
                "string-max": "{#label} should be at most {#limit} characters",
            })
            .required(),
        accountBalance: joi
            .number()
            .required(),
        customerEmail: joi
            .string()
            .email()
            .min(11)
            .message({
                "string-min": "{#label} should be at least {#limit} characters",
                "string-max": "{#label} should be at most {#limit} characters",
            })
            .required(),
        customerPassword: joiPassword
            .string()
            .minOfSpecialCharacters(1)
            .minOfLowercase(3)
            .minOfUppercase(1)
            .minOfNumeric(1)
            .noWhiteSpaces()
            .onlyLatinCharacters()
            .messages({
                'password.minOfUppercase': '{#label} should contain at least {#min} uppercase character',
                'password.minOfSpecialCharacters':
                    '{#label} should contain at least {#min} special character',
                'password.minOfLowercase': '{#label} should contain at least {#min} lowercase character',
                'password.minOfNumeric': '{#label} should contain at least {#min} numeric character',
                'password.noWhiteSpaces': '{#label} should not contain white spaces',
                'password.onlyLatinCharacters': '{#label} should contain only Latin characters',
            })
            .required(),
        customerGender: joi
            .string()
            .required(),
        customerProfilePic: joi
            .string()
            .required(),
        customerAddress: joi
            .string()
            .required(),
        customerPhone: joi
            .number()
            .max(9999999999)
            .min(1000000000)
            .message({
                "string-min": "{#label} should be at least {#limit} characters",
                "string-max": "{#label} should be at most {#limit} characters",
            })
            .required(),

    }).unknown(true),

    loginCustomer: joi.object({
        customerAccount: joi
            .string()
            .required(),
        customerPassword: joi
            .string()
            .required(),
    }).unknown(true),

    resetPassword: joi.object({
        newPassword: joiPassword
            .string()
            .minOfSpecialCharacters(1)
            .minOfLowercase(3)
            .minOfUppercase(1)
            .minOfNumeric(1)
            .noWhiteSpaces()
            .onlyLatinCharacters()
            .messages({
                'password.minOfUppercase': '{#label} should contain at least {#min} uppercase character',
                'password.minOfSpecialCharacters':
                    '{#label} should contain at least {#min} special character',
                'password.minOfLowercase': '{#label} should contain at least {#min} lowercase character',
                'password.minOfNumeric': '{#label} should contain at least {#min} numeric character',
                'password.noWhiteSpaces': '{#label} should not contain white spaces',
                'password.onlyLatinCharacters': '{#label} should contain only Latin characters',
            })
            .required(),
        confirmPassword: joiPassword
            .string()
            .required(),
    }),

    setNewPassword: joi.object({
        oldPassword: joiPassword
            .string()
            .required(),
        newPassword: joiPassword
            .string()
            .minOfSpecialCharacters(1)
            .minOfLowercase(3)
            .minOfUppercase(1)
            .minOfNumeric(1)
            .noWhiteSpaces()
            .onlyLatinCharacters()
            .messages({
                'password.minOfUppercase': '{#label} should contain at least {#min} uppercase character',
                'password.minOfSpecialCharacters':
                    '{#label} should contain at least {#min} special character',
                'password.minOfLowercase': '{#label} should contain at least {#min} lowercase character',
                'password.minOfNumeric': '{#label} should contain at least {#min} numeric character',
                'password.noWhiteSpaces': '{#label} should not contain white spaces',
                'password.onlyLatinCharacters': '{#label} should contain only Latin characters',
            })
            .required(),
        confirmPassword: joiPassword
            .string()
            .required(),
    }),

    depositBalance: joi.object({
        depositAmount: joi
            .number()
            .required(),
    }),

    withdrawBalance: joi.object({
        withdrawAmount: joi
            .number()
            .required(),
    })
};

module.exports = userValSchema;
