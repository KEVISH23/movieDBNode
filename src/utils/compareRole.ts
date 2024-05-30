import { Response,NextFunction } from "express"
import { DECODED } from "../interfaces"
import { errorHandler } from "./errorHandler"

export const compareRole = (data:DECODED,role:string[],res:Response,next:NextFunction) =>{
    try{
        if(role.includes(data.role)){
            next()
        }else{
            throw new Error(`Not ${role.join()}`)
        }
    }catch(err){
            const message:string = errorHandler(err)
            res.json({status:false,message})
        }
}