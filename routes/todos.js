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

router.post('/todo', async (req, res) => {
    const user = User.findOne({email: req.headers["email"]})
    if(!user){
        return res.status(400).json({message:'no auth'})
    }
    const counter = await Counter.findOne({name: 'default'});
    const board = await Board.findOne({id: req.body.boardId, acess: req.headers["email"]});
    let boardIndex;
    for (let i=0; i<board.lists.length; i++) {
        if (board.lists[i].collectionId === req.body.collId) {
            boardIndex = i;
            break;
        }
    }
    const todo = new Todo({
        id: counter.idCounter++,
        title: req.body.title,
        status: true,
    })
    if(!todo || !counter){
        return res.status(404).json({message: 'not found'})
    }
    if(!boardIndex && boardIndex!== 0){
        return res.status(404).json({message: 'boardIndex not found'})
    }
    board.lists[boardIndex].todos.push(todo);
    try {
        await board.save();
        await Counter.updateOne({name: 'default'}, {$inc: { idCounter: 1 }} ); // delete old
        res.status(200).json(todo)
        console.log(`todo was posted`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
})

router.delete('/todo-delete', async (req, res) => {
    let user = User.findOne({email: req.headers["email"]})
    if(!user){
        return res.status(400).json({message:'no auth'})
    }
    let zalupa = {
        id: req.body.id,
        title: req.body.title,
        status: req.body.status,
        collId: req.body.collId,
        boardId: req.body.boardId,
    }
    let board = await Board.findOne({id: req.body.boardId, acess: req.headers["email"]});
    let boardIndex;
    let todoIndex;
    for (let i=0; i<board.lists.length; i++) {
        if (board.lists[i].collectionId === req.body.collId) {
            boardIndex = i;
            break;
        }
    }
    for (let j=0; j<board.lists[boardIndex].todos.length; j++) {
        if (board.lists[boardIndex].todos[j].id === req.body.id) {
            todoIndex = j;
            break;
        }
    }
    if(!board){
        return res.status(404).json({message:'not found'})
    }   
    if(!boardIndex && boardIndex!== 0){
        return res.status(404).json({message: 'boardIndex not found'})
    }
    if(!todoIndex && todoIndex!== 0){
        return res.status(404).json({message: 'todoIndex not found'})
    }
    board.lists[boardIndex].todos.splice(todoIndex, 1);
    try {
        await board.save();
        res.status(200).json({message:'WAS DELETED'})
        console.log(`WAS DELETED`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
})

router.post('/change', async (req, res) => {
    let user = User.findOne({email: req.headers["email"]})
    if(!user){
        return res.status(400).json({message:'no auth'})
    }
    console.log(req.body)
    let board = await Board.findOne({id: req.body.boardId, acess: req.headers["email"]});
    let boardIndex;
    let todoIndex;
    for (let i=0; i<board.lists.length; i++) {
        for (let j=0; j<board.lists[i].todos.length; j++) {
            if (board.lists[i].todos[j].id === req.body.todo.id) {
                todoIndex = j;
                boardIndex = i;
                break;
            }
        }
    }
    if(!boardIndex && boardIndex!== 0){
        return res.status(404).json({message: 'boardIndex not found'})
    }
    if(!todoIndex && todoIndex!== 0){
        return res.status(404).json({message: 'todoIndex not found'})
    }
    board.lists[boardIndex].todos.splice(todoIndex, 1); // delete

    let indexOfTodoList;
    for (let i=0; i<board.lists.length; i++) {
        if (board.lists[i].collectionId === req.body.newListCollectionId) {
            indexOfTodoList = i;
            console.log(i)
        }
    }
    board.lists[indexOfTodoList].todos.splice(req.body.newTaskIndex, 0, req.body.todo)

    try {
        await board.save();
        console.log(`drag and drop was happened`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
})

module.exports = router
