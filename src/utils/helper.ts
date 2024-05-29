import mongoose, { PipelineStage } from "mongoose";
import { DECODED } from "../interfaces";

export function roleBased(reqUser:DECODED,fromService:string="default"):object{
    let roleWiseMatch:any
    return roleWiseMatch = {
        ...(reqUser.role === "Actor"
          ? fromService==="default"?{ cast: new mongoose.Types.ObjectId(reqUser._id) }:{ "cast._id": new mongoose.Types.ObjectId(reqUser._id)}
          : {}),
        ...(reqUser.role === "Producer"
          ?  fromService==="default"?{ producer: new mongoose.Types.ObjectId(reqUser._id) }:{ "producer._id": new mongoose.Types.ObjectId(reqUser._id) }
          : {}),
        ...(reqUser.role === "Director"
          ? fromService==="default"? { director: new mongoose.Types.ObjectId(reqUser._id) }:{ "director._id": new mongoose.Types.ObjectId(reqUser._id) }
          : {}),
      };
}

export function getAndQuery(array:any,query:any):PipelineStage[]{
    return query.$match = {
        ...query.$match,
        $and: [
            ...array
        ],
    }
}

export function getOrQuery(array:string[],query:any,search:string):PipelineStage[]{
    return query.$match = {
        ...query.$match,
        $or: array.map((ele)=>{
            return {[ele]:{$regex:search,$options:'i'}}
          })
      }
}