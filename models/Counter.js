const {Schema, model} = require("mongoose")

const schema = new Schema ({
    todosIDs: {
        type: Number,
        required: true
    },
    listsIDs: {
        type: Number,
        required: true
    }
})

module.exports = model('Counter', schema)