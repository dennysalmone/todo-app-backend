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

router.post('/boards-create', async (req, res) => {
    let user = User.findOne({email: req.headers["email"]})
    if(!user){
        return res.status(400).json({message:'no auth'})
    }
    let counter = await Counter.findOne({name: 'default'});
    const board = new Board({
        name: req.body.name,
        id: counter.idCounter++,
        author: req.headers["email"],
        acess: [req.headers["email"]],
        lists: []
    });
    if(!board){
        return res.status(404).json({message: 'not found'})
    }
    try {
        await board.save();
        await Counter.updateOne({name: 'default'}, {$inc: { idCounter: 1 }} ); // delete old
        res.status(200).json(board)
        console.log(`board with id ${board.id} was posted`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
})

router.get('/boards', async (req, res) => {
    let user = User.findOne({email: req.headers["email"]})
    if(!user){
        return res.status(400).json({message:'no auth'})
    }
    let boards = await Board.find( { acess: req.headers["email"] } )
    if(!boards){
        return res.status(404).json({message: 'not found'})
    }
    let getBoards = {email: req.headers["email"], boards: boards}
    res.status(200).json(getBoards)
})

router.delete('/delete-board', async (req, res) => {
    let user = await User.findOne({email: req.headers["email"]})
    if(!user){
        return res.status(400).json({message:'no auth'})
    }
    if(!req.body){
        return res.status(404).json({message: 'not found'})
    }
    try {
        await Board.deleteOne({id: req.body.boardId})
        res.status(200).json({message:'WAS DELETED'})
        console.log(`todolist was deleted`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
})

router.post('/boards-acess', async (req, res) => {
    let user = await User.findOne({email: req.headers["email"]})
    if(!user){
        return res.status(400).json({message:'no auth'})
    }
    let board = await Board.findOne({id: req.body.boardId, author: req.headers["email"]});
    if(!board || !req.body.acess){
        return res.status(404).json({message: 'not found'})
    }
    // board.acess = req.body.acess
    // console.log(board)
    try {
        // await board.save();
        await Board.updateOne({id: req.body.boardId, author: req.headers["email"]}, {$set : { acess : req.body.acess } } );
        res.status(200).json()
        console.log(`board was changed`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
})










module.exports = router