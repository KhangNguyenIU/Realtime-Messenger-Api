const mongoose = require('mongoose')
const ChatRoomSchema = require('../models/ChatRoom')

const readByRecipientSchema = new mongoose.Schema(
    {
      _id: false,
      readByUserId: String,
      readAt: {
        type: Date,
        default: Date.now(),
      },
    },
    {
      timestamps: false,
    }
  );
  
const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 250
    },
    chatRoomId: {
        type: mongoose.Types.ObjectId,
        ref: 'chatRoom'
    },
    readByRecipients: [readByRecipientSchema],
    postedBy: {
        type:mongoose.Types.ObjectId,
        ref:'user'
    }
},{timestamps:true})


messageSchema.statics.initMessage = async function(message, chatRoomId, postedBy){
    try {
        const chatRoom = await ChatRoomSchema.findById(chatRoomId)
        if(chatRoom && chatRoom.participants.includes(postedBy)){
            const newMessage = await this.create({message, chatRoomId, readByRecipients: [{readByUserId: postedBy}], postedBy})
            return newMessage
        }
        return null
            
    } catch (error) {
        throw "Error in initMessage"
    }
}

messageSchema.statics.getConversationByRoomId = async function(chatRoomId){
    try {
        const messages = await this.find({chatRoomId}).populate({path:'postedBy', select:'username avatar'})
        return messages
    } catch (error) {
        throw "Error in getConversationByRoomId"
    }
}
module.exports = MessageSchema = mongoose.model("message",messageSchema)