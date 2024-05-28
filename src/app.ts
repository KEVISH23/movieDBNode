import 'reflect-metadata'
import { InversifyExpressServer } from "inversify-express-utils";
import express from 'express'
import cors from 'cors'
import { dbConnect } from "./db/dbConfig";
import config from 'config'
import { container } from "./inversify.config";
import './controller'
const app = express()
app.use(express.json())
app.use(cors())
const server = new InversifyExpressServer(container,app)
server.setConfig(async ()=>{
    await dbConnect()
})
server.build().listen(config.get('port'),()=>console.log('port connection established'));

// link for api documentation:- https://documenter.getpostman.com/view/34315314/2sA3Qs9rW2