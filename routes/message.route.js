
const express = require('express')
const { createMessage, getConversationByChatroomId,getImagesOfConversation} = require('../controllers/message.controller')
const { createMessageValidator } = require('../validators/auth.validator')
const { authMidleware } = require('../middlewares/auth.middleware')

const route = express.Router()

route.post('/create/:chatRoomId',authMidleware,createMessageValidator, createMessage)
route.post('/:chatRoomId' ,authMidleware,getConversationByChatroomId)
route.post('/images/:chatRoomId' ,getImagesOfConversation)

module.exports = route