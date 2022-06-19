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
    let boards = await Board.find( { author: req.headers["email"] } )
    if(!boards){
        return res.status(404).json({message: 'not found'})
    }
    console.log(`Boards was getted`);
    res.status(200).json(boards)
})













module.exports = router