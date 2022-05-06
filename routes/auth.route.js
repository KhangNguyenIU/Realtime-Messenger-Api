
const express = require('express')
const { login, register , authUser} = require('../controllers/auth.controller')
const { authMidleware } = require('../middlewares/auth.middleware')
const { registerValidator } = require('../validators/auth.validator')

const route = express.Router()

route.post('/login',registerValidator, login)

route.post('/register',registerValidator, register)

route.post('/authenticate', authMidleware, authUser)

module.exports = route