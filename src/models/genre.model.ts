import mongoose from "mongoose";
const GenreSchema = new mongoose.Schema({
    genreName:{
        type:String,
        required:[true,'Genre name is required'],
        trim:true
    }
},{
    timestamps:true
})

const Genre = mongoose.model('Genre',GenreSchema)
export {Genre}