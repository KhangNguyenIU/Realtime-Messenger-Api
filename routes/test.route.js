const express = require('express')
const res = require('express/lib/response')

const route = express.Router()

route.get('/', (req, res)=>res.send("hello"))

module.exports = route