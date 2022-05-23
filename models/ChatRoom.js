const mongoose = require('mongoose')
const UserSchema = require('./User')
const _ = require('lodash')
const chatRoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    chatInitiator: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    participants: [
        { type: mongoose.Types.ObjectId, ref: 'user' }
    ],
    avatar: {
        type: String,
        default: "https://images.unsplash.com/photo-1652794878123-bc3049bf4120?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387",
        minlength: 0,
        maxlength: 300
    },
    bio: { type: String, default: "", minlength: 0, maxlength: 170 },
    messages: [
        { type: mongoose.Types.ObjectId, ref: 'message' }
    ],
    theme: { type: String, default: "#E68585" },
    autoDelete: { type: Boolean, default: false },
    duration: { type: Number, default: 0 },
}, { timestamps: true })


chatRoomSchema.statics.initChatroom = async function (chatInitiator, participants, name) {
    try {
        // console.log({ name, chatInitiator, participants })
        const _participants = participants.includes(chatInitiator) ? participants : [...participants, chatInitiator]
        const newRoom = await this.create({ name, chatInitiator, participants: _participants })
        return newRoom

    } catch (error) {
        throw "Error occur when init chatroom"
    }
}

chatRoomSchema.statics.deleteChatRoom = async function (chatRoomId) {
    try {
        const chatRoom = await this.findByIdAndDelete(chatRoomId)
        return chatRoom
    } catch (error) {
        throw "Error occur when delete chatroom"
    }
}

chatRoomSchema.statics.getChatroom = async function (chatRoomId) {
    try {
        //findbyid and sort by updated
        const chatRoom = await this.findById(chatRoomId)
        return chatRoom
    } catch (error) {
        throw "Error occur when get chatroom"
    }
}

chatRoomSchema.statics.getChatroomsOfUser = async function (userId) {
    try {
        const chatrooms = await this.find({ participants: { $elemMatch: { $eq: userId } } }, null, { sort: "-updatedAt" })
            .populate({ path: 'participants', select: 'username avatar' })
            .populate({
                path: 'messages', select: 'message postedBy createdAt type',
                options: {
                    limit: 2, sort: { 'createdAt': -1 }
                },
                populate: [{ path: 'postedBy', select: 'username avatar' },
                { path: 'readByRecipients', select: 'readByUserId readAt' }
                ],
            })
        return chatrooms
    } catch (error) {
        throw "Error occur when get chatrooms of user"
    }
}

chatRoomSchema.statics.leaveRoom = async function (chatRoomId, userId) {
    try {
        const chatRoom = await this.findById(chatRoomId)
        if (chatRoom) {
            const newParticipants = chatRoom.participants.filter(participant => participant != userId)
            const newRoom = await this.findByIdAndUpdate(chatRoomId, { participants: newParticipants })
            return newRoom
        }
    } catch (error) {
        throw "Error occur when leave room"
    }
}

chatRoomSchema.statics.addParticipant = async function (chatRoomId, userId) {
    try {
        const chatRoom = await this.findById(chatRoomId)
        const user = await UserSchema.findById(userId)
        if (chatRoom && user && chatRoom.participants.indexOf(userId) == -1) {
            const newParticipants = chatRoom.participants.concat(userId)
            const newRoom = await this.findByIdAndUpdate(chatRoomId, { participants: newParticipants })
            return newRoom
        }
    } catch (error) {
        throw "Error occur when add participant"
    }
}


chatRoomSchema.statics.updateChatroomInfo = async function (chatRoomId, fields = {}) {
    try {
        const { name, bio, avatar } = fields
        const updateChatroom = {
            ...(name && { name }),
            ...(bio && { bio }),
            ...(avatar && { avatar })
        }

        let chatRoom = await this.findByIdAndUpdate(chatRoomId, updateChatroom)

        return chatRoom

    } catch (error) {
        throw "Error occur when update chatroom"
    }
}

module.exports = ChatRoomSchema = mongoose.model("chatRoom", chatRoomSchema)