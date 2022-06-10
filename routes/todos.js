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

router.post('/todo', async (req, res) => {
    const todoList = await TodoList.findOne({userEmail: req.headers["email"]});
    const todo = new Todo({
        id: req.body.id,
        title: req.body.title,
        status: req.body.status,
    })
    todoList.todos.push(todo);
    try {
        await todoList.save();
        console.log(`${todo.title} was posted`);
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
        if (todoList[i].collectionId === newCollId && todoList[i].userEmail == req.headers["email"]) {
            todoList[i].todos.splice(newTaskIndex, 0, todo);
            indexOfTodoList = i
        }
    } // add new

    try {
        await TodoList.updateOne({collectionId: idOfTodoList, userEmail: req.headers["email"]}, {$pull : { todos : { id : idOfTodo} } } ); // delete old
        await todoList[indexOfTodoList].save(); // add new
        console.log(`DRAG AND DROP WAS UPDATED`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
})

router.delete('/todo', async (req, res) => {
    let todoList = await TodoList.find({userEmail: req.headers["email"]});
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
