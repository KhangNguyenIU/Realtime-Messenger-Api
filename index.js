const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const http = require('http')
const helmet = require('helmet')

require('dotenv').config()
require('./config/mongo')


const Port = process.env.PORT || 8000

const app = express()
app.use(morgan('dev'))
app.use(cors())
app.use(helmet())
app.disable('x-powered-by')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/auth', require('./routes/auth.route'))
app.use('/api/user', require('./routes/user.route'))
app.use('/api/chatroom', require('./routes/chatroom.route'))
app.use('/api/message', require('./routes/message.route'))
app.use('/api/test', require('./routes/test.route'))

const server = http.createServer(app)

const socketIo = require('socket.io')(server, {
    allowEIO3: true,
    cors: {
        origin: true,
        methods: ['GET', 'POST'],
        credentials: true
    }
})

require('./utils/WebSocket')(socketIo)

server.listen(Port, () => {
    console.log("Server is running on port " + Port)
})

