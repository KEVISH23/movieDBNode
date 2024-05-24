import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema({
    movieName:{
        type:String,
        required:[true,'Movie name is required'],
        trim:true
    },
    cast:[{
       
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        
    }],
    producer:[{
        
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        
    }],
    genre:[{
        
            type:mongoose.Schema.Types.ObjectId,
            ref:"Genre"
        
    }],
    director:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,'Director is required'],
        ref:"User",
        trim:true
    },
    budget:{
        type:Number,
        required:[true,'Budget is required'],
        trim:true
    },
    releaseDate:{
        type:Date,
        required:[true,'Release Date is required'],
        trim:true
    }
},{
    timestamps:true
})

const Movie = mongoose.model("Movie",MovieSchema)
export {Movie}