import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        trim:true
    },
    dob:{
        type:Date,
        required:[true,'D.O.B is required'],
        max:[new Date(),"Dont enter future Date"]
    },
    name:{
        type:String,
        required:[true,'Name is required'],
        trim:true
    },
    age:{
        type:Number,
        trim:true
    },
    role:{
        type:String,
        enum:["Actor","Producer","Director","Admin"],
        required:[true,"Role is required"]
    },
    gender:{
        type:String,
        enum:["Male","Female"],
        required:[true,"Gender is required"]
    },
    token:{
        type:String,
        default:""
    }
},{
    timestamps:true
})

UserSchema.pre('save',async function(next){
    if (this.password) {
        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(this.password, salt)
        this.password = hashPassword
    }
    if(this.dob){
        const todayDate:Date = new Date()
        const dob:Date = new Date(this.dob)
        const age:number = Math.abs(dob.getUTCFullYear()-todayDate.getUTCFullYear())
        this.age = age
    }
})
const User = mongoose.model('User',UserSchema)
export {User}