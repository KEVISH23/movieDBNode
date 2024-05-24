import { Request } from "express"

export interface IUSER{
    name:string,
    email:string,
    password:string,
    dob:Date,
    age?:number,
    role:string,
    gender:string,
    _id?:string,
    createdAt?:Date,
    updatedAt?:Date,
    token?:string
}

export interface DECODED{
    email:string,
    role:string,
    _id:string,
    iat?:string
}

export interface REQUSER extends Request{
    user:DECODED
}
