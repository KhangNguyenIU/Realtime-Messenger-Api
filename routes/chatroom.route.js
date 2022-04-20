
const express = require('express')
const { createChatRoom, deleteChatRoom,getChatroomOfaUser, leaveRoom, addParticipant, updateInfoChatroom } = require('../controllers/chatroom.controller')
const { authMidleware } = require('../middlewares/auth.middleware')


const route = express.Router()

route.post('/create', authMidleware, createChatRoom)
route.delete('/delete/:chatRoomId', authMidleware, deleteChatRoom)
route.get('/get-user-rooms', authMidleware, getChatroomOfaUser)
route.get('/leave/:chatRoomId', authMidleware, leaveRoom)
route.post('/add-participant/:chatRoomId', authMidleware, addParticipant)
route.put('/update/:chatRoomId', authMidleware, updateInfoChatroom)


module.exports = route