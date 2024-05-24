import mongoose from "mongoose"
import config from 'config'

export const dbConnect = async () =>{
    mongoose.connect(config.get("dbUrl")).then(()=>console.log('connected')).catch(err=>console.log('Not connected',err))
}