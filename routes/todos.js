const { Router } = require('express')
const Todo = require("../models/Todo")
const TodoList = require("../models/TodoList")
const router = Router()
var bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/todo', async (req, res) => {
    const todos = await TodoList.find({});
    console.log(`todos was getted`);
    res.send(todos);
})

router.put('/todo', async (req, res) => {
    // неактуальный запрос на смену статуса, заменить на пут.драгендропп
    // const todo = new Todo({
    //     id: req.body.id,
    //     title: req.body.title,
    //     status: req.body.status,
    // })
    // try {
    //     await Todo.findOneAndReplace({id:todo.id, title: todo.title, status: !todo.status},{id:todo.id, title: todo.title, status: todo.status})
    //     console.log(`${todo} was changed`);
    // } catch (e) {
    //     console.log(`Error: ${e.message}`);
    // }
})

router.delete('/todo-list', async (req, res) => {
    const todoList = new TodoList({
        name: req.body.name,
        collectionId: req.body.collectionId,
        todos: req.body.todos,
    });
    try {
        await TodoList.remove({ name: todoList.name, collectionId: todoList.collectionId, todos: todoList.todos})
        console.log(`${todoList} was deleted`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
})

router.post('/todo-list', async (req, res) => {
    const todoList = new TodoList({
        name: req.body.name,
        collectionId: req.body.collectionId,
        todos: req.body.todos,
    });
    try {
        await todoList.save(); // должно работать, позже проверить
        console.log(`${todoList} was posted`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
})

router.post('/todo', async (req, res) => {
    const todoList = await TodoList.findOne();
    const todo = new Todo({
        id: req.body.id,
        title: req.body.title,
        status: req.body.status,
      })
      todoList.todos.push(todo);
    try {
        await todoList.save();
        console.log(`${todoList} was posted`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
})

router.delete('/todo', async (req, res) => {
    const todoList = await TodoList.find({});
    const todo = new Todo({
        id: req.body.id,
        title: req.body.title,
        status: req.body.status,
    });
    let idOfTodoList;
    let idOfTodo;
    for (let i=0; i<todoList.length; i++) {
        for (let j=0; j<todoList[i].todos.length; j++) {
            if (todoList[i].todos[j].id === todo.id && todoList[i].todos[j].title === todo.title && todoList[i].todos[j].status === todo.status ) {
                idOfTodoList = todoList[i].collectionId
                idOfTodo = todoList[i].todos[j].id
                break;
            }
        }
    }
    try {
        await TodoList.updateOne({collectionId: idOfTodoList}, {$pull : { todos : {id : idOfTodo} } } );
        console.log(`WAS DELETED`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
})

module.exports = router