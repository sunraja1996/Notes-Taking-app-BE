const mongoose = require('mongoose');
const validator = require('validator');
const { noteModel } = require('./noteSchema');


const UserSchema = new mongoose.Schema({
    firstName : {type:String, require:true},
    lastName : {type:String, require:true},
    email:{
        type:String,
        lowercase:true,
        require:true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    username :{type:String, require:true},
    password:{type:String, require:true},
    role:{type:String, default:'user'},
    emailVerify:{type:String, default:'N'},
    imageUrl: { type: String },
    tempOTP:{type:String, default:null},
    createdAt:{type:String, default: Date.now()}
}, {collection:'users', versionKey:false})

UserSchema.virtual('notes', {
    ref : 'noteModel',
    localField: '_id',
    foreignField: 'owner'
})

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;

    return userObject
}


const userModel = mongoose.model('users', UserSchema)

module.exports= {userModel}