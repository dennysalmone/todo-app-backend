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
                message: 'Некорректные данные при регистрации'
            })
        }

        const user = await User.findOne({email: req.body.email})
        if (!user) {
            return res.status(400).json({message: "Пользователь не найден"})
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res.status(400).json({message: 'Неверный пароль'})
        }

        const token = jwt.sign(
            { email: req.body.email },
            privateKey,
            { expiresIn: '1h'}
        )
        console.log(`Request accepted i give you token`)
        res.json({token: `${token}`}) // !!!

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

        let candidate = await User.findOne({email: req.body.email})
        if (candidate) {
            return res.status(400).json({message: 'This use alredy exists'})
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12)
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
        })
        await user.save()
        console.log(`Пользователь создан по почте ${req.body.email}`)
        res.status(201).json({message: 'User had created'})
    }
    catch (e) {
        res.status(500).json({message: e.message})
    }
})

module.exports = router