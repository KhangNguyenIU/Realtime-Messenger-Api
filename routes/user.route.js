
const express = require('express')
const { getUserByEmail,updateUser } = require('../controllers/user.controller')
const { authMidleware } = require('../middlewares/auth.middleware')
const { registerValidator } = require('../validators/auth.validator')

const route = express.Router()

route.get('/:email',authMidleware, getUserByEmail)
route.put('/:email', updateUser)

module.exports = route