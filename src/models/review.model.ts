import mongoose from "mongoose";
const ReviewSchema = new mongoose.Schema({
    reviewer:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,'Reviewer is required'],
        ref:"User"
    },
    movieId:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,'Movie is required'],
        ref:"Movie"
    },
    ratings:{
        type:Number,
        required:[true,"Rating is required"],
        min:[0,"Minimum 0"],
        max:[5,"Maximum 5"]
    }
})

const Review = mongoose.model('Review',ReviewSchema)
export {Review}