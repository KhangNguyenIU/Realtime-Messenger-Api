const { check } = require('express-validator');
const {PASSWORD_REGEX} = require('../constants');

exports.registerValidator = [
    check('email', "Email is required")
        .not()
        .isEmpty(),
    check('email', "Email is not valid")
        .isEmail(),
    check("password","Password is required").not().isEmpty(),
    check('password', "Password must be at least 6 characters  and less than 20 characters ")
        .isLength({ min: 6, max: 20 })
        .withMessage("Password must be at least 6 characters  and less than 20 characters "),
    check('password', "Password must contain at least one uppercase character")
        .matches(PASSWORD_REGEX)
]

exports.createMessageValidator =[
    check('message', "Message is required")
        .not()
        .isEmpty()
]