const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const http = require('http')
const helmet = require('helmet')


require('dotenv').config()

require('./config/mongo')
// require('./config/redis')

const Port = process.env.PORT || 8000
const app = express()

app.use(morgan('dev'))
app.use(cors({
    origin:  ["https://wad-chat-app-frontend.vercel.app","http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}))

// app.use(helmet())
app.disable('x-powered-by')
app.use(helmet())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use('/api/auth', require('./routes/auth.route'))
app.use('/api/user', require('./routes/user.route'))
app.use('/api/chatroom', require('./routes/chatroom.route'))
app.use('/api/message', require('./routes/message.route'))
app.use('/api/test', require('./routes/test.route'))

const server = http.createServer(app)

const socketIo = require('socket.io')(server, {
    allowEIO3: true,
    cors: {
        origin: ["https://wad-chat-app-frontend.vercel.app","http://localhost:3000"],
        methods: ['GET', 'POST'],
    }
 
})

global.io = socketIo
require('./utils/WebSocket')(socketIo)

const autoDelete = require('./utils/autoDelete')

server.listen(Port, () => {
    console.log("Server is running on port " + Port)
})

