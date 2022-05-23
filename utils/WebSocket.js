const MessageSchema = require('../models/Message')
const autoDelete = require('../utils/autoDelete')
const {cloudinary} = require('../config/cloudinary')

const { TYPE_IMAGE, TYPE_TEXT} = require('../constants/')
module.exports = function (io) {

    let users = []

    io.on('connection', socket => {

        console.log("User connect---------", socket.id)

        socket.on('disconnect', () => {
            users = users.filter(user => user.socketId !== socket.id)
        })

        socket.on('identity', userId => {
            users.push({ socketId: socket.id, userId })
        })

        socket.on('leaveRoom', roomId => {
            socket.leave(roomId)
        })

        socket.on('joinRoom', roomId => {
            socket.join(roomId)
            io.to(roomId).emit('notification', `${socket.id} has join room`)
        })

        socket.on('notification', data => {
            console.log(data)
        })

        socket.on('send-message', async ({ ...fields }) => {
            const { chatRoomId, message, postedBy, type } = fields
            let rawMessage = message
            if (typeof message !== 'string')
                return;
            try {
                //! If message is image : upload to cloudinary return url
                if (type === TYPE_IMAGE) {
                    const imageUrl = await cloudinary.uploader.upload(rawMessage, {
                        upload_preset: 'cloud_set'
                    })
                    if(!imageUrl)
                        return
                    rawMessage = imageUrl.url
                }

                const [message, chatRoom] = await MessageSchema.initMessage(rawMessage, chatRoomId, postedBy, type)
                if (!message || !chatRoom)
                    return;

                //! check if message in auto delete mode 
                //! if yes, then delete message after x seconds
                if (chatRoom.autoDelete) {
                    autoDelete.add(chatRoom._id, message._id, chatRoom.duration)
                }
                const processedMessage = await MessageSchema.getMessageById(message._id)
                if (!processedMessage)
                    return;

                io.to(chatRoomId).emit('recieve-message', { chatRoomId, message: processedMessage })
                io.to(chatRoomId).emit('notification', `${socket.id} has write sth ${message.message}`)
                // get all client of a socket room

                for (let user of users) {
                    if (chatRoom.participants.indexOf(user.userId) !== -1) {

                        socket.broadcast.to(user.socketId).emit("new-message-notify", { reload: true })
                    }
                }
            } catch (error) {
                console.log(error)
            }

        })

        socket.on('user-typing', fields => {
            const { chatRoomId, user } = fields
            io.to(chatRoomId).emit('user-typing', {
                user: user,
                isTyping: true
            })
        })

        socket.on('user-stop-typing', fields => {
            const { chatRoomId, user } = fields
            io.to(chatRoomId).emit('user-typing', {
                user: user,
                isTyping: false
            })
        })

        socket.on('user-read-message', async (fields) => {
            const { user, message } = fields
            if (!user || !message)
                return;

            try {
                const updateMess = await MessageSchema.readedByUser(user, message)
                // console.log("UPADTEAASD", updateMess)
                if (updateMess) {
                    console.log("broadcast", socket.id)
                    console.log("--", users)
                    for (let socketUser of users) {
                        if (socketUser.userId === user) {
                            console.log("emit", socketUser.socketId)
                            // io.broadcast.to(socketUser.socketId).emit("newF-notify", {reload: true})
                            socket.emit('user-read-message', { reload: true })
                        }
                    }
                }
            } catch (error) {
                console.log(error)
            }

        })
    })
}