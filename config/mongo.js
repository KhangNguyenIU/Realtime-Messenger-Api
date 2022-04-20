const mongoose = require('mongoose')


mongoose.connect(process.env.DB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology:true
})

mongoose.connection.on('connected', () => {
    console.log('Mongo has connected succesfully')
  })
  mongoose.connection.on('reconnected', () => {
    console.log('Mongo has reconnected')
  })
  mongoose.connection.on('error', error => {
    console.log('Mongo connection has an error', error)
    mongoose.disconnect()
  })
  mongoose.connection.on('disconnected', () => {
    console.log('Mongo connection is disconnected')
  })