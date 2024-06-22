import { injectable } from "inversify";
import { IUSER } from "../interfaces";
import { User } from "../models";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import config from 'config'
import { responseMessage } from "../constants";
@injectable()
export class UserService{
    async getUsers():Promise<IUSER[]>{
        try{
            return await User.find()
        }catch(err:any){
            throw (err)
        }
    }
    async registerUser(data:IUSER):Promise<void>{
        try{
            await User.create(data)
        }catch(err:any){
            throw (err)
        }
    }

    async loginService(email:string,password:string):Promise<IUSER|null>{
        try {
            const user:IUSER|null = await User.findOne({email})
            if(!user){
                throw new Error(responseMessage.NOTREGISTERED)
            }
            const comparePass = bcrypt.compareSync(password,user.password)
            if(!comparePass){
                throw new Error(responseMessage.INVALID_CREDENTIALS)
            }
            if(user.token && user.token.length > 0){
                throw new Error(responseMessage.ALREADY_LOGGEDIN)
            }
            const {_id,role} = user
            const token = jwt.sign({_id,email,role  },config.get("SECRET_KEY"))
            await User.findOneAndUpdate({email},{
                $set:{token}
            })
            const user1:IUSER|null = await User.findOne({email})
            return user1

        } catch (error:any) {
            throw(error)
        }
    }

    async logoutService(_id:string):Promise<void>{
        try {
            await User.findByIdAndUpdate({_id},{
                $set:{token:""}
            })
        } catch (error) {
            throw(error)
        }
    }
    async getDirectorService():Promise<any>{
        try{
            return await User.find({role:"Director"},{_id:1,name:1})
        }catch(err:any){
            throw (err)
        }
    }
    async getProducerService():Promise<any>{
        try{
            return await User.find({role:"Producer"},{_id:1,name:1})
        }catch(err:any){
            throw (err)
        }
    }
    async getActorService():Promise<any>{
        try{
            return await User.find({role:"Actor"},{_id:1,name:1})
        }catch(err:any){
            throw (err)
        }
    }
}