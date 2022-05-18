const { errorHandler } = require("../handler/DBhandler");
const ChatRoomSchema = require("../models/ChatRoom");

module.exports = {
    createChatRoom: async (req, res) => {
        try {
            const newRoom = await ChatRoomSchema.initChatroom(req.user, req.body.participants, req.body.name)
            console.log({ newRoom })
            if (newRoom) {
                return res.status(200).json({ newRoom })
            }
            return res.status(400).json({
                error: "Error occur when init chatroom"
            })

        } catch (error) {
            return res.status(400).json({
                error: errorHandler(error)
            })
        }
    },
    deleteChatRoom: async (req, res) => {
        try {
            const chatroom = await ChatRoomSchema.getChatroom(req.params.chatRoomId)
            if (chatroom) {
                if (chatroom.chatInitiator == req.user) {
                    const deletedRoom = await ChatRoomSchema.deleteChatRoom(req.params.chatRoomId)
                    if (deletedRoom) {
                        return res.status(200).json({
                            message: "Chatroom deleted"
                        })
                    }
                }
            }

            return res.status(400).json({
                error: "Error occur when delete chatroom"
            })
        } catch (error) {
            return res.status(400).json({
                error: errorHandler(error)
            })
        }
    },
    getChatroomOfaUser: async (req, res) => {
        try {
            const chatrooms = await ChatRoomSchema.getChatroomsOfUser(req.user)

            if (chatrooms) {
                return res.status(200).json({
                    chatrooms
                })
            }
            return res.status(400).json({
                error: "Error occur when get chatrooms of user"
            })
        } catch (error) {
            return res.status(400).json({
                error: errorHandler(error)
            })
        }
    },
    leaveRoom: async (req, res) => {
        try {
            const chatroom = await ChatRoomSchema.getChatroom(req.params.chatRoomId)
            if (chatroom) {
                if (chatroom.participants.includes(req.user)) {
                    const newRoom = await ChatRoomSchema.leaveRoom(req.params.chatRoomId, req.user)
                    if (newRoom) {
                        return res.status(200).json({
                            message: "You left the chatroom"
                        })
                    }
                }
            }
            return res.status(400).json({
                error: "Error occur when leave room"
            })
        } catch (error) {
            return res.status(400).json({
                error: errorHandler(error)
            })
        }
    },
    addParticipant: async (req, res) => {
        try {
            const chatroom = await ChatRoomSchema.getChatroom(req.params.chatRoomId)
            if (chatroom) {

                const newRoom = await ChatRoomSchema.addParticipant(req.params.chatRoomId, req.body.userId)
                if (newRoom) {
                    return res.status(200).json({
                        message: "Participant added"
                    })
                }
            }
            return res.status(400).json({
                error: "Error occur when add participant"
            })
        } catch (error) {
            return res.status(400).json({
                error: errorHandler(error)
            })
        }
    },
    updateInfoChatroom: async (req, res) => {
        try {
            const { bio, name, avatar } = req.body
            const chatroomId = req.params.chatRoomId
            const updatedRoom = await ChatRoomSchema.updateChatroomInfo(chatroomId, { bio, name, avatar })

            if (updatedRoom) {
                return res.status(200).json({        
                    message: "Update room info success"
                })
            }
            return res.status(400).json({
                error: "Error occur when update room info"
            })
        } catch (error) {
            return res.status(400).json({
                error: errorHandler(error)
            })
        }
    },
     getLastMessageOfChatroom : async (req, res)=>{
         try {
            const lastMessage = await ChatRoomSchema.getLastMessageOfChatroom(req.params.chatRoomId)
            
            return res.status(200).json({
                lastMessage
            })
         }catch(error){
             return res.status(400).json({
                    error: errorHandler(error)
             })
         }
     }
}
