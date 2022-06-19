const {Schema, model} = require("mongoose")

const schema = new Schema ({
    name:       { type: String, required: true },
    id:         { type: Number },
    author:     { type: String, required: true },
    acess:      { type: Array, required: true },
    lists:      [{
        name:           { type: String, required: true },
        desc:           { type: String, required: true },
        collectionId:   { type: Number, required: true },
        userEmail:      { type: String },
        todos:[{
            id:     { type: Number, required: true },
            title:  { type: String, required: true },
            status: { type: Boolean, required: true },
        }]
    }]
})

module.exports = model('Board', schema)