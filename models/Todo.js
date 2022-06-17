const {Schema, model} = require("mongoose")

const schema = new Schema ({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    status: { type: Boolean, required: true }
})

module.exports = model('Todo', schema)