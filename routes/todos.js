const { Router } = require('express')
const Todo = require("../models/Todo")
const TodoList = require("../models/TodoList")
const router = Router()
var bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/todo', async (req, res) => {
    const todoList = await TodoList.find({});
    console.log(`todoList was getted`);
    res.send(todoList);
})

router.delete('/todo-list', async (req, res) => {
    const todoList = new TodoList({
        name: req.body.name,
        collectionId: req.body.collectionId,
        todos: req.body.todos,
    });
    try {
        await TodoList.deleteOne({ name: todoList.name, collectionId: todoList.collectionId, todos: todoList.todos})
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
        console.log(`${todo} was posted`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
})

router.post('/change', async (req, res) => {
    let todoList = await TodoList.find({});
    let todo = new Todo({
        id: req.body.todo.id,
        title: req.body.todo.title,
        status: req.body.todo.status,
    });
    let newCollId = req.body.newListCollectionId;
    let newTaskIndex = req.body.newTaskIndex;
    console.log(req.body)

    let idOfTodoList;
    let idOfTodo;
    for (let i=0; i<todoList.length; i++) {
        for (let j=0; j<todoList[i].todos.length; j++) {
            if (todoList[i].todos[j].id === todo.id && todoList[i].todos[j].title === todo.title && todoList[i].todos[j].status === todo.status ) {
                idOfTodoList = todoList[i].collectionId
                idOfTodo = todoList[i].todos[j].id
                todoList[i].todos.splice(j, 1);
                break;
            }
        }
    } // delete old

    let indexOfTodoList;
    for (let i=0; i<todoList.length; i++) {
        if (todoList[i].collectionId === newCollId) {
            todoList[i].todos.splice(newTaskIndex, 0, todo);
            indexOfTodoList = i
        }
    } // add new

    try {
        await TodoList.updateOne({collectionId: idOfTodoList}, {$pull : { todos : { id : idOfTodo} } } ); // delete old
        await todoList[indexOfTodoList].save(); // add new
        console.log(`DRAG AND DROP WAS UPDATED`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
})

router.delete('/todo', async (req, res) => {
    let todoList = await TodoList.find({});
    let todo = new Todo({
        id: req.body.id,
        title: req.body.title,
        status: req.body.status,
    });
    if(!todo || !todoList){
        return res.status(404).json({message:'not found'})
    }   
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
        await TodoList.updateOne({collectionId: idOfTodoList}, {$pull : { todos : { id : idOfTodo} } } );
        console.log(`WAS DELETED`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
})

module.exports = router





// var removed = myFish.splice(3, 1); удаляем что-то по индексу 3
//var removed = myFish.splice(2, 0, 'drum'); вставляем текст по индексу 2 и не удаляем ничего
