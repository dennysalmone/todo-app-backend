const express = require('express')
const mongoose = require('mongoose')
const todoRoutes = require('./routes/todos');
const PORT = process.env.PORT || 3000
const app = express() //сервер
let mongoURL = 'mongodb+srv://dennysalmone777:dennysalmone7771@clusterdenny.pedk5.mongodb.net/denny-todos'

app.use(todoRoutes)

async function start() {
    try {
        await mongoose.connect(mongoURL, {
            useNewUrlParser: true
        })
        app.listen(PORT, () => {
            console.log(`Server has been started on ${PORT} port...`)
        })
    } catch (e) {
        console.log(e)
    }
}

start() 