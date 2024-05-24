import { NextFunction, Request, Response} from "express";
import { controller,request,response,httpPost,httpGet } from "inversify-express-utils";
import { MovieService, UserService } from "../service";
import { responseMessage, TYPES } from "../constants";
import { inject } from "inversify";
import {  IBOC, IMOVIES, REQUSER } from "../interfaces";
import { compareRole, errorHandler } from "../utils";
import { PipelineStage } from "mongoose";


// @controller('/movies',TYPES.AuthMiddleware,(req:REQUSER, res:Response ,next:NextFunction)=>{
//     compareRole(req.user,"Admin",res,next)
// })
@controller('/movies')
export class MovieController{

    constructor(
        @inject<MovieService>(TYPES.MovieService) private movieService:MovieService
    ){}

    @httpGet('/',TYPES.AuthMiddleware)
    async getMovies(@request() req:REQUSER,@response() res:Response):Promise<void>{
        try{
            const {role,_id,email} = req.user
            const {actorName,directorName,producerName,releaseDateRange,budgetRange,search,genre} = req.query
            const data:IMOVIES[] = await this.movieService.getMovies({role,_id,email},{
                actorName:actorName?.toString(),
                directorName:directorName?.toString(),
                producerName:producerName?.toString(),
                releaseDateRange:releaseDateRange?.toString(),
                budgetRange:budgetRange?.toString(),
                search:search?.toString(),
                genre:genre?.toString()
            })
            res.json({status:true,data})
        }catch(err){
            const message:string = errorHandler(err)
            res.json({status:false,message})
        }
    }


    @httpPost('/addMovies',TYPES.AuthMiddleware,(req:REQUSER, res:Response ,next:NextFunction)=>{
            compareRole(req.user,"Admin",res,next)
         })
    async addMovies(@request() req:REQUSER,@response() res:Response):Promise<void>{
        try {
            const {movieName,cast,producer,genre,director,releaseDate,budget} = req.body
            await this.movieService.addMovies({movieName,cast,producer,genre,director,releaseDate,budget})
            res.json({status:true,message:responseMessage.MOVIECREATED})
        } catch (err) {
            const message:string = errorHandler(err)
            res.json({status:false,message})
        }
    }

    @httpPost('/addCollection',TYPES.AuthMiddleware,(req:REQUSER, res:Response ,next:NextFunction)=>{
        compareRole(req.user,"Admin",res,next)
     })
     async addCollection(@request() req:REQUSER,@response() res:Response):Promise<void>{
        try {
            const {movieId,boxOfficecollection} = req.body
            await this.movieService.addCollectionService({movieId,boxOfficecollection})
            res.json({status:true,message:responseMessage.COLLECTADDED})
        } catch (err) {
            const message:string = errorHandler(err)
            res.json({status:false,message})
        }
     }

     @httpGet('/getCollection',TYPES.AuthMiddleware)
     async getCollection(@request() req:REQUSER,@response() res:Response):Promise<void>{
        try {    
                                                                                                                                                                              const {role,_id,email} = req.user
        const {actorName,directorName,producerName,releaseDateRange,budgetRange,search,genre,collectionRange} = req.query                                                                                                  
            const data:IBOC[] = await this.movieService.getCollection({role,_id,email},{
                actorName:actorName?.toString(),
                directorName:directorName?.toString(),
                producerName:producerName?.toString(),
                releaseDateRange:releaseDateRange?.toString(),
                budgetRange:budgetRange?.toString(),
                search:search?.toString(),
                genre:genre?.toString(),
                collectionRange:collectionRange?.toString()
            })
            res.json({status:true,data})
        } catch (error:any) {
            const message:string = errorHandler(error)
            res.json({status:false,message})
        }
     }
}