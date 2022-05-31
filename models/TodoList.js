const {Schema, model} = require("mongoose")
// const Todo = require("../models/Todo")

const schema = new Schema({
    name:{type: String},
    collectionId:{type: Number},
    todos:[{
        id: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        status: {
            type: Boolean,
            required: true
        }
    }]
}) 

module.exports = model('TodoList', schema)