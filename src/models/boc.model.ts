import mongoose from "mongoose";

const BoxOfficeSchema = new mongoose.Schema({
    movieId:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,'Movie id is required'],
        ref:"Movie",
        trim:true
    },
    boxOfficecollection:{
        type:Number,
        required:[true,'Collection is required'],
        trim:true
    }
})

const BoxOffice = mongoose.model('BoxOffice',BoxOfficeSchema)
export {BoxOffice}