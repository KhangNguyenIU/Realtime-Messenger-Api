const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const http = require('http')
const helmet = require('helmet')
// const cloudinary = require('cloudinary')

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME || "dmdiv5ldu",
//     api_key: process.env.CLOUDINARY_API_KEY || "541435637713187",
//     api_secret: process.env.CLOUDINARY_API_SECRET || "axDu_iiz0N_xXAAxFFF1bycN7r0"
// })

require('dotenv').config()
require('./config/mongo')

const Port = process.env.PORT || 8000

const app = express()

app.use(morgan('dev'))
app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}))

// app.use(helmet())
app.disable('x-powered-by')
app.use(helmet())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))

app.use('/api/auth', require('./routes/auth.route'))
app.use('/api/user', require('./routes/user.route'))
app.use('/api/chatroom', require('./routes/chatroom.route'))
app.use('/api/message', require('./routes/message.route'))
app.use('/api/test', require('./routes/test.route'))

const server = http.createServer(app)

const socketIo = require('socket.io')(server, {
    // allowEIO3: true,
    // cors: {
    //     origin: ["https://wad-chat-app-frontend.vercel.app","http://localhost:3000"],
    //     allowedHeaders:["secretHeader"],
    //     methods: ['GET', 'POST'],
    //     credentials: true
    // }
    // ,
    // handlePreflightRequest: (req, res) => {
    //     res.writeHead(200, {
    //       "Access-Control-Allow-Origin": ["https://wad-chat-app-frontend.vercel.app","http://localhost:3000"],
    //       "Access-Control-Allow-Methods": "GET,POST",
    //       "Access-Control-Allow-Headers": "secretHeader",
    //       "Access-Control-Allow-Credentials": true
    //     });
    //     res.end();
    //   }
    cors: {
        origin : "*"
    }
})
global.io = socketIo
require('./utils/WebSocket')(socketIo)

const autoDelete = require('./utils/autoDelete')

server.listen(Port, () => {
    console.log("Server is running on port " + Port)
})

