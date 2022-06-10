const { Router } = require('express')
const Todo = require("../models/Todo")
const TodoList = require("../models/TodoList")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const router = Router()
const bodyParser = require('body-parser')
const User = require('../models/User')
const {check, validationResult} = require('express-validator')
const privateKey = 'BJ8Hf0HBm%y%6h2'

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/todo', async (req, res) => {
    const todoList = await TodoList.find({userEmail: req.headers["email"]});
    console.log(`todoList was getted`);
    res.send(todoList);
})

router.delete('/todo-list', async (req, res) => {
    const todoList = new TodoList({
        name: req.body.name,
        collectionId: req.body.collectionId,
        todos: req.body.todos,
        userEmail: req.headers["email"]
    });
    try {
        await TodoList.deleteOne({ name: todoList.name, collectionId: todoList.collectionId, todos: todoList.todos, userEmail: req.headers["email"]})
        console.log(`todolist with id ${todoList.collectionId} was deleted`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
})

router.post('/todo-list', async (req, res) => {
    const todoList = new TodoList({
        name: req.body.name,
        collectionId: req.body.collectionId,
        todos: req.body.todos,
        userEmail: req.headers["email"]
    });
    try {
        await todoList.save(); // должно работать, позже проверить
        console.log(`todolist with id ${todoList.collectionId} was posted`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
})

module.exports = router