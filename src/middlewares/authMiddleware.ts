import {  Response, NextFunction } from "express";
import { BaseMiddleware } from "inversify-express-utils";
import { responseMessage } from "../constants";
import jwt from 'jsonwebtoken'
import {REQUSER } from "../interfaces";
import config from 'config'
import { errorHandler } from "../utils";
export class AuthMiddleware extends BaseMiddleware{
    handler(req: REQUSER, res: Response<any, Record<string, any>>, next: NextFunction): void {
        try{
            // console.log(req.headers)
            const token = req.headers.authorization?.split(' ')[1]
            if(!token){
                throw new Error(responseMessage.TOKENNOTPROVIDED)
            }
            jwt.verify(token.toString(),config.get("SECRET_KEY"),(err:any,decoded:any)=>{
                if(err){
                    throw new Error(responseMessage.TOKENINVALID)
                }
                req.user = decoded
                next()
            })
        }catch(err:any){
            const message:string = errorHandler(err)
            res.json({status:false,message})
        }
    }
}