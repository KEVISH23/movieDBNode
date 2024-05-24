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
    }
})

const Review = mongoose.model('Review',ReviewSchema)
export {Review}