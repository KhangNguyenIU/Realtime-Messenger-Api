const { errorHandler } = require("../handler/DBhandler");
const MessageSchema = require('../models/Message');


module.exports ={
    createMessage : async (req, res)=>{
        try {
            const [message, chatRoom] = await MessageSchema.initMessage(req.body.message, req.params.chatRoomId, req.user)

            if(message){
                return res.status(200).json({
                    message: "Message created successfully",
                    data: message
                })
            }
            return res.status(400).json({
                message: "Cannot implement this action"
            })
        } catch (error) {
            return res.status(400).json({
                error : errorHandler(error)
            })
        }
    },
    getConversationByChatroomId : async (req, res)=>{
        try {
            const messages = await MessageSchema.getConversationByRoomId(req.params.chatRoomId)
            if(messages){
                return res.status(200).json({
                    message: "Messages fetched successfully",
                    data: messages
                })
            }
            return res.status(400).json({
                message: "Cannot implement this action"
            })
        } catch (error) {
            return res.status(400).json({
                error : errorHandler(error)
            })
        }
    },
    getImagesOfConversation : async (req, res)=>{
        try {
            const messages = await MessageSchema.getImagesOfConversation(req.params.chatRoomId)
            console.log({messages})
            if(messages){
                return res.status(200).json({
                    message: "Images fetched successfully",
                    data: messages
                })
            }
            return res.status(400).json({
                message: "Cannot implement this action"
            })
        } catch (error) {
            return res.status(400).json({
                error : errorHandler(error)
            })
        }
    }
}