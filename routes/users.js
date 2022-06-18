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

router.post(
    '/login', 
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Некорректный password').isLength({min: 6})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect data during registration'
            })
        }

        const user = await User.findOne({email: req.body.email})
        if (!user) {
            return res.status(400).json({message: "user is not found"})
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res.status(400).json({message: 'invalid password'})
        }

        const token = jwt.sign(
            { email: req.body.email },
            privateKey,
            { expiresIn: '1h'}
        )
        console.log(`Request accepted i give you token`)
        res.json({token: `${token}`})

    }
    catch (e) {
        res.status(500).json({message: e.message})
    }
})

router.post(
    '/register', 
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Некорректный password').isLength({min: 6})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при входе'
            })
        }
        let counter = await Counter.findOne({name: 'default'});
        let candidate = await User.findOne({email: req.body.email})
        if (candidate) {
            return res.status(400).json({message: 'This use alredy exists'})
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12)
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
            userId: counter.userIDs++
        })
        await user.save()
        await Counter.updateOne({name: 'default'}, {$inc: { userIDs: 1 }} );
        console.log(`Пользователь создан по почте ${req.body.email}`)
        return res.status(201).json({message: 'User had created'})
    }
    catch (e) {
        res.status(500).json({message: e.message})
    }
})

module.exports = router