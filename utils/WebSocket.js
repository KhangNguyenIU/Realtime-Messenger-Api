const MessageSchema = require('../models/Message')

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
            const { chatRoomId, message, postedBy } = fields
            // console.log("user", socket.id, "send message", message)
            let rawMessage = message
            if (typeof message === 'string') {
                const [message, chatRoom] = await MessageSchema.initMessage(rawMessage, chatRoomId, postedBy)
                if (message) {
                    const processedMessage = await MessageSchema.getMessageById(message._id)
                    if (processedMessage) {
                        io.to(chatRoomId).emit('recieve-message', { chatRoomId, message: processedMessage })
                        io.to(chatRoomId).emit('notification', `${socket.id} has write sth ${message.message}`)
                       // get all client of a socket room

                       for (let user of users){
                           if(chatRoom.participants.indexOf(user.userId)!== -1){
                            //    console.log(user)""
                            socket.broadcast.to(user.socketId).emit("new-message-notify", {reload: true})
                           }
                       }
                    }
                }
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

        socket.on('user-read-message',async(fields)=>{
            const {user, message} = fields
            // update message with user has been readed
            if( user && message){
                try{
                    const updateMess = await MessageSchema.readedByUser(user, message)
                    console.log("UPADTEAASD", updateMess)
                    if(updateMess){
                        socket.broadcast.to(socket.id).emit("new-message-notify", {reload: true})
                    }
                }catch(error){
                    console.log(error)
                }
            }
        })
    })
}