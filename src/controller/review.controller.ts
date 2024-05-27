import { NextFunction, Request, Response} from "express";
import { controller,request,response,httpPost,httpGet } from "inversify-express-utils";
import { MovieService, ReviewService, UserService } from "../service";
import { responseMessage, TYPES } from "../constants";
import { inject } from "inversify";
import {  IBOC, IMOVIES, IREVIEW, REQUSER } from "../interfaces";
import { compareRole, errorHandler } from "../utils";


@controller('/review')
export class ReviewController {
    constructor(@inject<ReviewService>(TYPES.ReviewService) private reviewService:ReviewService){}

    @httpPost('/addReview',TYPES.AuthMiddleware)
    async addReview(@request() req:REQUSER,@response() res:Response):Promise<void>{
        try {
            const {movieId,ratings} = req.body
            const {_id} = req.user
            const data = {
                reviewer:_id,
                movieId,
                ratings
            }
            await this.reviewService.addReview(data)
            res.json({status:true,message:responseMessage.REVIEWADD})
        } catch (error) {
            const message:string = errorHandler(error)
            res.json({status:false,message})
        }
    }

    @httpGet('/',TYPES.AuthMiddleware)
    async getReview(@request() req:REQUSER,@response() res:Response):Promise<void>{
        try {
            const {role,_id,email} = req.user
            const data:IREVIEW[] = await this.reviewService.getReview({role,_id,email})
            res.json({status:true,data})
        } catch (error) {
            const message:string = errorHandler(error)
            res.json({status:false,message})
        }
    }
}