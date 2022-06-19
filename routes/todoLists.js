const { Router } = require('express')
const Todo = require("../models/Todo")
const TodoList = require("../models/TodoList")
const Board = require("../models/Board")
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

router.delete('/delete-list', async (req, res) => {
    let user = await User.findOne({email: req.headers["email"]})
    if(!user){
        return res.status(400).json({message:'no auth'})
    }
    if(!req.body){
        return res.status(404).json({message: 'not found'})
    }
    try {
        await Board.updateOne({id: req.body.boardId}, {$pull : { lists : { collectionId : req.body.collId } } } );
        res.status(200).json({message:'WAS DELETED'})
        console.log(`todolist was deleted`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
})

router.post('/todo-list', async (req, res) => {
    let user = await User.findOne({email: req.headers["email"]})
    if(!user){
        return res.status(400).json({message:'no auth'})
    }
    let counter = await Counter.findOne({name: 'default'});
    const todoList = new TodoList({
        name: req.body.name,
        desc: req.body.desc,
        collectionId: counter.idCounter++,
        userEmail: req.headers["email"],
        todos: [],
    });

    let board = await Board.findOne({id: req.body.boardId, acess: [req.headers["email"]]});

    if(!board || !todoList){
        return res.status(404).json({message: 'not found'})
    }
    board.lists.push(todoList);
    try {
        await board.save();
        await Counter.updateOne({name: 'default'}, {$inc: { idCounter: 1 }} );
        res.status(200).json(todoList)
        console.log(`todolist was posted`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
})

module.exports = router