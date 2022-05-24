const { Router } = require('express')
const Todo = require("../models/Todo")
const router = Router()
var bodyParser = require('body-parser')
let data = [
    // {id:0, title: "это не использутся но пусть побудет", status: false}
];

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/get-to-front', async (req, res) => {
    // идешь в монгу и извлекаешь тудухи 
    // res.send(твои ебаные тудухи которые ты получил с монги)
    const todos = await Todo.find({})
    console.log(`${todos} was getted`)
    res.send(todos)
})

router.delete('/delete-from-front', async (req, res) => {
    const todo = new Todo({
        id: req.body.id,
        title: req.body.title,
        status: req.body.status
    })
    try {
        await Todo.remove({ id: todo.id, title: todo.title })
        console.log(`${todo} was deleted`)
    } catch (e) {
        console.log(`Error: ${e.message}`)
    }
})

router.put('/put-from-front', async (req, res) => {
    const todo = new Todo({
        id: req.body.id,
        title: req.body.title,
        status: req.body.status
    })
    try {
        await Todo.findOneAndReplace({id:todo.id, title: todo.title, status: !todo.status},{id:todo.id, title: todo.title, status: todo.status})
        console.log(`${todo} was changed`)
    } catch (e) {
        console.log(`Error: ${e.message}`)
    }
})

router.post('/post-from-front', async (req, res) => {
    // получаешь тело запроса 
    // записываешь в монгу 
    // отправляешь статус 200 типо, все заебись, записалось
    const todo = new Todo({
        id: req.body.id,
        title: req.body.title,
        status: req.body.status
      })
    try {
        await todo.save()
        console.log(`${todo} was posted`)
    } catch (e) {
        console.log(`Error: ${e.message}`)
    }
})

module.exports = router