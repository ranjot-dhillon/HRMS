import mongoose from 'mongoose';

const UserSchema= new mongoose.Schema( {
    name:{type:String,required: 'True'},
    email:{type:String,required: 'True'},
    password:{type:String,required : 'True'},
    role:{type:String,enum:["admin","employee"],required : 'True'},
    profileImage:{type:String},
    createAt:{type:Date,default:Date.now},
    updateAt:{type:Date,default:Date.now}
})
const User=mongoose.model("User",UserSchema);

export default User;