const UserSchema = require('../models/User')

const { validationResult } = require('express-validator');
const { errorHandler } = require('../handler/DBhandler');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const firstError = errors.array().map(error => error.msg)[0];
            console.log(errors)
            return res.status(401).json({
                error: firstError
            })
        }
        const { email, password } = req.body;

        const user = await UserSchema.findByEmail(email);
        // console.log("userr", user)
        const validated = await UserSchema.validate(password, user.password);
        if (validated) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.cookie('token', token, { expiresIn: '7d' });
            return res.status(200).json({
                token
            })
        }

        return res.status(400).json({
            error: "Invalid Credentials"
        })
    } catch (error) {
        // console.log(error)
        return res.status(400).json({
            message: error
        })
    }
}

const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const firstError = errors.array().map(error => error.msg)[0];
            console.log(errors)
            return res.status(401).json({
                error: firstError
            })
        }
        const { username, email, password } = req.body;

        const existedUser = await UserSchema.findOne({ email: email });
        if (existedUser)
            return res.status(400).json({
                message: 'Email already exists'
            })

        const newuser = await UserSchema.createUser(username, email, password);

        if (newuser) {
            console.log(newuser)
            return res.status(200).json({
                username, email, password
            })
        }
    } catch (error) {
        console.log({ error })
        return res.status(400).json({
            message: errorHandler(error)
        })
    }
}

const authUser = async (req, res)=>{
    try{
        const user = await UserSchema.findByToken(req.user)
        if(user){
            return res.status(200).json({
                user
            }) 
        }
    }catch(error){
        return res.status(400).json({
            message: errorHandler(error)
        })
    }
}

module.exports = { login, register, authUser }