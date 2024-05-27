import { injectable } from "inversify";
import { DECODED, IBOC, IGETCOLLECTION, IGETMOVIES, IMOVIES, IREVIEW, IUSER, REQUSER } from "../interfaces";
import { BoxOffice, Movie, Review } from "../models";
import { responseMessage } from "../constants";
import { getCollectionPipeline, getMoviesPipeline, reviewPipeline } from "../utils";
import mongoose, { PipelineStage } from "mongoose";
@injectable()
export class ReviewService{
    async addReview(data:IREVIEW):Promise<void>{
        try {
            await Review.create(data)
        } catch (error) {
            throw(error)
        }
    }

    async getReview(reqUser:DECODED):Promise<IREVIEW[]>{
        try {
            const pipeline:PipelineStage[] = [...reviewPipeline]
            return await Review.aggregate(pipeline)
        } catch (error) {
            throw(error)
        }
    }
}