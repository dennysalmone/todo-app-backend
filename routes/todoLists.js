const { Router } = require('express')
const Todo = require("../models/Todo")
const TodoList = require("../models/TodoList")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const router = Router()
const bodyParser = require('body-parser')
const User = require('../models/User')
const Counter = require('../models/Counter')
const {check, validationResult} = require('express-validator')
const privateKey = 'BJ8Hf0HBm%y%6h2'

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/todo', async (req, res) => {
    let user = User.findOne({email: req.headers["email"]})
    if(!user){
        return res.status(400).json({message:'no auth'})
    }
    const todoList = await TodoList.find({userEmail: req.headers["email"]});
    console.log(`todoList was getted`);
    if(!todoList){
        return res.status(404).json({message: 'not found'})
    }
    res.status(200).json(todoList)
})

router.delete('/todo-list', async (req, res) => {
    let user = User.findOne({email: req.headers["email"]})
    if(!user){
        return res.status(400).json({message:'no auth'})
    }
    const todoList = new TodoList({
        name: req.body.name,
        desc: req.body.desc,
        collectionId: req.body.collectionId,
        todos: req.body.todos,
        userEmail: req.headers["email"]
    });
    if(!todoList){
        return res.status(404).json({message: 'not found'})
    }
    try {
        await TodoList.deleteOne({ name: todoList.name, collectionId: todoList.collectionId, todos: todoList.todos, userEmail: req.headers["email"]})
        res.status(200).json({message:'WAS DELETED'})
        console.log(`todolist with id ${todoList.collectionId} was deleted`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
})

router.post('/todo-list', async (req, res) => {
    let user = User.findOne({email: req.headers["email"]})
    if(!user){
        return res.status(400).json({message:'no auth'})
    }
    let counter = await Counter.findOne({name: 'default'});
    const todoList = new TodoList({
        name: req.body.name,
        desc: req.body.desc,
        collectionId: counter.listsIDs++,
        todos: req.body.todos,
        userEmail: req.headers["email"]
    });
    if(!todoList){
        return res.status(404).json({message: 'not found'})
    }
    try {
        await todoList.save();
        await Counter.updateOne({name: 'default'}, {$inc: { listsIDs: 1 }} ); // delete old
        res.status(200).json(todoList)
        console.log(`todolist with id ${todoList.collectionId} was posted`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
})

module.exports = router