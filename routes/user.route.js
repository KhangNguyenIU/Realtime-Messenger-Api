
const express = require('express')
const { getUserByEmail,updateUser,up, updateUserOnlineStatus, getUserList } = require('../controllers/user.controller')
const { authMidleware } = require('../middlewares/auth.middleware')
const { registerValidator } = require('../validators/auth.validator')

const route = express.Router()

route.get('/:email',authMidleware, getUserByEmail)
route.put('/:id', updateUser)
route.put('/user-status/:id', updateUserOnlineStatus)
route.post('/user-list', authMidleware, getUserList )
module.exports = route