const MessageSchema = require('../models/Message')

// class WebSocket {
//     users = []

//     connection(client) {
//         console.log("socket",global.io)
//         client.on('disconnect', () => {
//             this.users.filter(user => user.socketId !== client.id)
//         })

//         client.on('indentity', (userId) => {
//             this.users.push({
//                 socketId: client.id,
//                 userId: userId
//             })
//             global.io.emit('hello',"users")
//         })

//         client.on('unsubcribe', () => {
//             client.leave(room)
//         })

//         client.on("subscribe", (room, otherUserId = "") => {
//             this.subscribeOtherUser(room, otherUserId);
//             client.join(room);
//         });
//     }
//     subcribeOtherUser(room, otherUserId) {
//         const usersSocket = this.users.filter(user => user.userId === otherUserId)

//         usersSocket.map(userInfo => {
//             const socketCon = global.io.sockets.connected(userInfo.socketId)
//             if (socketCon) {
//                 socketCon.join(room)
//             }
//         })
//     }
// }

// module.exports = new WebSocket()


module.exports = function (io) {

    let users = []

    io.on('connection', socket => {

        console.log(socket.id)

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

        socket.on('send-message', async ({...fields}) => {
            const {chatRoomId, message, postedBy} = fields
            const newMessage = await MessageSchema.initMessage(message, chatRoomId, postedBy)

            if(newMessage){
                io.to(chatRoomId).emit('recieve-message', newMessage.message)
                io.to(chatRoomId).emit('notification', `${socket.id} has write sth ${newMessage.message}`)
            }
        })


    })
}