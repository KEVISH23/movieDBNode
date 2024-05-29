import { Request, Response } from "express";
import { controller,request,response,httpPost,httpGet } from "inversify-express-utils";
import { UserService } from "../service";
import { responseMessage, TYPES } from "../constants";
import { inject } from "inversify";
import { IUSER, REQUSER } from "../interfaces";
import { errorHandler } from "../utils";
import { User } from "../models";
import { MongoClient } from "mongodb";


const client = new MongoClient('mongodb+srv://kevishshaligram:6c4N5WasDRzZ9dMG@cluster0.ro8j6zq.mongodb.net/localDB?retryWrites=true&w=majority&appName=Cluster0')

const session = client.startSession()
@controller('/users')
export class UserController{
    constructor(
        @inject<UserService>(TYPES.UserService) private userService:UserService
    ){}
    @httpGet('/')
    async getUsers(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            const data:IUSER[] = await this.userService.getUsers()
            res.json({status:true,data})
        }catch(err){
            const message:string = errorHandler(err)
            res.json({status:false,message})
        }
    }

    @httpPost('/register')
    async registerUser(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            const {email,dob,password,name,role,gender} = req.body
            await this.userService.registerUser({email,dob,password,name,role,gender})
            res.json({status:true,message:responseMessage.CREATED})
        }catch(err:any){
            const message:string = errorHandler(err)
            res.json({status:false,message})
        }
    }


    @httpPost('/login')
    async loginUser(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            const {email,password} = req.body
            await this.userService.loginService(email,password)
            res.json({status:true,message:responseMessage.LOGGEDIN})
        }catch(err:any){
            const message:string = errorHandler(err)
            res.json({status:false,message})
        }
    }

    @httpPost('/logout',TYPES.AuthMiddleware)
    async logout(@request() req:REQUSER,@response() res:Response):Promise<void>{
        try{
            const {_id} = req.user
            await this.userService.logoutService(_id)
            res.json({status:true,message:responseMessage.LOGGEDOUT})
        }catch(err:any){
            const message:string = errorHandler(err)
            res.json({status:false,message})
        }
    }

    @httpPost('/bulkwrite')
    async bulkwrite(@request() req:REQUSER,@response() res:Response):Promise<void>{
        try{
            const transaction = session.startTransaction()
            await User.bulkWrite([
                {insertOne:{
                    document:{
                        password:"1234",
                        dob:"1987-11-23",
                        role:"Actor",
                        gender:"Female",
                        name:"Katrina kaif",
                        email:"katrinakaif1@gmail.com",
                    }
                }},
                {insertOne:{
                    document:{
                        password:"1234",
                        dob:"1987-11-23",
                        role:"Actor",
                        gender:"Female",
                        name:"Katrina kaif",
                        email:"katrinakaif1@gmail.com",
                    }
                }}
            ])
            await transaction.commitTransaction()
        }catch(err:any){
            await transaction.abortTransaction()
            const message:string = errorHandler(err)
            res.json({status:false,message})
        }
    }
}