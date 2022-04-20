
const express = require('express')
const { login, register } = require('../controllers/auth.controller')
const { registerValidator } = require('../validators/auth.validator')

const route = express.Router()

route.post('/login',registerValidator, login)

route.post('/register',registerValidator, register)


module.exports = route