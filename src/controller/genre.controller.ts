import { NextFunction, Request, Response } from "express";
import { controller,request,response,httpPost,httpGet } from "inversify-express-utils";
import { GenreService } from "../service";
import { responseMessage, TYPES } from "../constants";
import { inject } from "inversify";
import { REQUSER } from "../interfaces";
import { compareRole, errorHandler } from "../utils";



@controller('/admin/genre',TYPES.AuthMiddleware,(req:REQUSER, res:Response ,next:NextFunction)=>{
    compareRole(req.user,"Admin",res,next)
})

export class GenreController{

    constructor(
        @inject<GenreService>(TYPES.GenreService) private genreService:GenreService
    ){}

    @httpPost('/addGenre')
    async addGenre(@request() req:REQUSER,@response() res:Response):Promise<void>{
        try {
            const {genreName} = req.body
            await this.genreService.addGenreService({genreName})
            res.json({status:true,message:responseMessage.GENRECREATED})
        } catch (error) {
            // console.log(error)
            const message:string = errorHandler(error)
            res.json({status:false,message})
        }
        
    }
}