const mongoose = require('mongoose');
const validator = require('validator');


const noteSchema = new mongoose.Schema({
    content:{
        type : String,
        require: true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        require : true,
        ref : "users"
    }
}, {
    toJSON: {virtuals : true}
},
{collection:'notes', versionKey:false})

const noteModel = mongoose.model('notes', noteSchema)

module.exports= {noteModel}