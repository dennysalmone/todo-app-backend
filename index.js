const express = require('express')
const mongoose = require('mongoose')

const todoRoutes = require('./routes/todos');
const todoListsRoutes = require('./routes/todoLists');
const usersRoutes = require('./routes/users');
const board = require('./routes/board');

const PORT = process.env.PORT || 3000
const app = express() //сервер
const auth = require('./middleware/auth.js');
let mongoURL = 'mongodb+srv://dennysalmone777:dennysalmone7771@clusterdenny.pedk5.mongodb.net/denny-todos'


app.use(auth);
app.use(todoRoutes);
app.use(todoListsRoutes);
app.use(usersRoutes);
app.use(board);

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