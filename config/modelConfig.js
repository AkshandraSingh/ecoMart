const mongoose = require('mongoose')

const mainLogger = require('../utils/mainLogger')

mongoose.connect(process.env.URL)

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected successfully')
    mainLogger.info('Mongoose is connected successfully')
})

mongoose.connection.on('error', (error) => {
    console.log('Mongoose Error!')
    console.log(`Error: ${error}`)
    mainLogger.error('Mongoose Error!')
    mainLogger.error(`Error: ${error}`)
})
