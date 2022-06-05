const mongoose = require('mongoose')
const ChatRoomSchema = require('../models/ChatRoom')


const MessageType ={
    TYPE_TEXT: "TEXT",
    TYPE_IMAGE: "IMAGE",
}

module.exports ={
    MessageType
}

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
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    type: { type: String, default: MessageType.TYPE_TEXT },
    deleteAt: { type: Date, default: null },
}, { timestamps: true })


messageSchema.statics.initMessage = async function (message, chatRoomId, postedBy, type) {
    try {
        const chatRoom = await ChatRoomSchema.findById(chatRoomId)
        if (chatRoom && chatRoom.participants.includes(postedBy)) {
            const newMessage = await this.create({ message, chatRoomId, readByRecipients: [{ readByUserId: postedBy }], postedBy ,type})
            // console.log("init message", chatRoom.messages)
            if(newMessage){
                chatRoom.messages.push(newMessage)
                await chatRoom.save()
                return [newMessage, chatRoom]
            }
        }
        return null
    } catch (error) {
        throw "Error in initMessage"
    }
}

messageSchema.statics.getConversationByRoomId = async function (chatRoomId) {
    try {
        const messages = await this.find({ chatRoomId }).populate({ path: 'postedBy', select: 'username avatar' })
        return messages
    } catch (error) {
        throw "Error in getConversationByRoomId"
    }
}

messageSchema.statics.getImagesOfConversation = async function (chatRoomId) {
    try {
        const messages = await this.find({ chatRoomId, type: MessageType.TYPE_IMAGE }).populate({ path: 'postedBy', select: 'username avatar' })
        return messages
    } catch (error) {
        throw "Error in get images of conversation"
    }
}

messageSchema.statics.getMessageById = async function (messageId) {
    try {
        const message = await this.findById(messageId).populate({ path: 'postedBy', select: 'username avatar' })
        return message
    } catch (error) {
        throw "Error in get message"
    }
}

messageSchema.statics.readedByUser = async function (userId, messageId) {
    try {
        const message = await this.getMessageById(messageId)
        console.log(message)
        message.readByRecipients.push({
            readByUserId: userId
        })
        await message.save()
        return message
    } catch (error) {
        throw "Error in update message"
    }
}

messageSchema.statics.deleteMessageById = async function (messageId){
    try {
        const message = await this.findById(messageId)
        if(message){
            await message.remove()
            return message
        }
        return null
    } catch (error) {
        throw "Error in delete message"
    }
}
module.exports = MessageSchema = mongoose.model("message", messageSchema)