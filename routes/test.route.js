const express = require('express')
const { test } = require('../controllers/test.controller')

const route = express.Router()

route.post('/', test)

module.exports = route