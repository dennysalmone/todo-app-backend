const {Schema, model} = require("mongoose")

const schema = new Schema ({
    todosIDs: { type: Number, required: true },
    listsIDs: { type: Number, required: true },
    boardIDs: { type: Number, required: true },
    userIDs: { type: Number, required: true },
    name: { type: String, required: true }
})

module.exports = model('Counter', schema)