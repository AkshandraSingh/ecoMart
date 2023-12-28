const mongoose = require('mongoose')

mongoose.connect(process.env.URL)

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected successfully')
})

mongoose.connection.on('error', (error) => {
    console.log('Mongoose Error!')
    console.log(`Error: ${error}`)
})
