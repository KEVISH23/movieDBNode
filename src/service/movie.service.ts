import { injectable } from "inversify";
import { DECODED, IBOC, IGETCOLLECTION, IGETMOVIES, IMOVIES, IUSER, REQUSER } from "../interfaces";
import { BoxOffice, Movie } from "../models";
import { responseMessage } from "../constants";
import { getCollectionPipeline, getMoviesPipeline } from "../utils";
import mongoose, { PipelineStage } from "mongoose";
@injectable()
export class MovieService {
  async getMovies(reqUser: DECODED, reqQuery: IGETMOVIES): Promise<IMOVIES[]> {
    try {
      const {
        actorName,
        directorName,
        producerName,
        releaseDateRange,
        budgetRange,
        search,
        genre
      } = reqQuery;
      let query = {
        $match:{}
      }
      const roleWiseMatch = {
        ...(reqUser.role === "Actor"
          ? { cast: new mongoose.Types.ObjectId(reqUser._id) }
          : {}),
        ...(reqUser.role === "Producer"
          ? { producer: new mongoose.Types.ObjectId(reqUser._id) }
          : {}),
        ...(reqUser.role === "Director"
          ? { director: new mongoose.Types.ObjectId(reqUser._id) }
          : {}),
      };

      const releaseDateRangeArr: string[] | undefined = releaseDateRange?.split("/");
      const budgetRangeArr:String[]|undefined = budgetRange?.split("-")

      const filteredArray = [
        ...(actorName ? [{ actorName }] : []),
        ...(genre ? [{ genre }] : []),
        ...(directorName ? [{ directorName }] : []),
        ...(producerName ? [{ producerName }] : []),
        ...(releaseDateRangeArr
          ? releaseDateRangeArr.length === 2
            ? [
                {
                  releaseDate: {
                    $gte: new Date(releaseDateRangeArr[0]),
                    $lte: new Date(releaseDateRangeArr[1]),
                  },
                },
              ]
            : [{ releaseDate: { $gte: releaseDateRangeArr[0] } }]
          : []),
        ...(budgetRangeArr
          ? budgetRangeArr.length === 2
            ? [
                {
                  budget: {
                    $gte: Number(budgetRangeArr[0]),
                    $lte: Number(budgetRangeArr[1]),
                  },
                },
              ]
            : [{ budget: { $gte: budgetRangeArr[0] } }]
          : []),
      ];
      filteredArray.length>0 ? query.$match = {
        ...query.$match,
        $and: [
            ...filteredArray
        ],
      }:null

     search ? query.$match = {
        ...query.$match,
        $or: ["actorName","producerName","directorName","movieName","genre"].map(ele=>{
            return {[ele]:{$regex:search,$options:'i'}}
          })
      }:null
      const pipeline: PipelineStage[] = [
        {
          $match: {
            ...roleWiseMatch,
          },
        },
        ...getMoviesPipeline,
        {
            $match:{
                ...query.$match
            }
        },{
            $project:{
              directorName:1,
              actorName:1,
              producerName:1,
              movieName:1,
              releaseDate:1,
              _id:1,
              budget:1,
              genre:1
            }
          }
      ];
    //   console.log(query)
    //   return pipeline
      return await Movie.aggregate(pipeline);
    } catch (error) {
      throw error;
    }
  }

  async addMovies(data: IMOVIES): Promise<void> {
    try {
      if (!data.cast) {
        throw new Error("Cast is required");
      }
      if (!data.producer) {
        throw new Error("Producer is required");
      }
      if (!data.genre) {
        throw new Error("Genre is required");
      }
      await Movie.create(data);
    } catch (error) {
      throw error;
    }
  }

  async addCollectionService(data:IBOC):Promise<void>{
    try {
        await BoxOffice.create(data)
    } catch (error) {
      throw(error)
    }
  }

  async getCollection(reqUser: DECODED, reqQuery: IGETCOLLECTION):Promise<IBOC[]>{
    try {
      const {
        actorName,
        directorName,
        producerName,
        releaseDateRange,
        budgetRange,
        search,
        genre,
        collectionRange
      } = reqQuery;
      let query = {
        $match:{}
      }

      // console.log(reqUser)
      const roleWiseMatch = {
        ...(reqUser.role === "Actor"
          ? { "cast._id": new mongoose.Types.ObjectId(reqUser._id) }
          : {}),
        ...(reqUser.role === "Producer"
          ? { "producer._id": new mongoose.Types.ObjectId(reqUser._id) }
          : {}),
        ...(reqUser.role === "Director"
          ? { "director._id": new mongoose.Types.ObjectId(reqUser._id) }
          : {}),
      };

      const releaseDateRangeArr: string[] | undefined = releaseDateRange?.split("/");
      const budgetRangeArr:String[]|undefined = budgetRange?.split("-")
      const collectionRangeArr:String[]|undefined = collectionRange?.split("-")

      const filteredArray = [
        ...(actorName ? [{ actorName }] : []),
        ...(genre ? [{ genre }] : []),
        ...(directorName ? [{ directorName }] : []),
        ...(producerName ? [{ producerName }] : []),
        ...(releaseDateRangeArr
          ? releaseDateRangeArr.length === 2
            ? [
                {
                  releaseDate: {
                    $gte: new Date(releaseDateRangeArr[0]),
                    $lte: new Date(releaseDateRangeArr[1]),
                  },
                },
              ]
            : [{ releaseDate: { $gte: new Date(releaseDateRangeArr[0]) } }]
          : []),
        ...(budgetRangeArr
          ? budgetRangeArr.length === 2
            ? [
                {
                  budget: {
                    $gte: Number(budgetRangeArr[0]),
                    $lte: Number(budgetRangeArr[1]),
                  },
                },
              ]
            : [{ budget: { $gte: Number(budgetRangeArr[0]) } }]
          : []),
        ...(collectionRangeArr
          ? collectionRangeArr.length === 2
            ? [
                {
                  boxOfficecollection: {
                    $gte: Number(collectionRangeArr[0]),
                    $lte: Number(collectionRangeArr[1]),
                  },
                },
              ]
            : [{ boxOfficecollection: { $gte: Number(collectionRangeArr[0]) } }]
          : []),
      ];
      filteredArray.length>0 ? query.$match = {
        ...query.$match,
        $and: [
            ...filteredArray
        ],
      }:null

     search ? query.$match = {
        ...query.$match,
        $or: ["actorName","producerName","directorName","movieName","genre"].map(ele=>{
            return {[ele]:{$regex:search,$options:'i'}}
          })
      }:null
      const pipeline: PipelineStage[] = [
        ...getCollectionPipeline,
        {
          $match: {
            ...roleWiseMatch,
          },
        },
        {
            $match:{
                ...query.$match
            }
        },{
          $project:{
            directorName:1,
            actorName:1,
            producerName:1,
            movieName:1,
            releaseDate:1,
            _id:1,
            budget:1,
            boxOfficecollection:1,
            genreName:1,
            recovered:1,
            verdict:1
          }
        }
      ];
      return await BoxOffice.aggregate(pipeline)
    } catch (error) {
      throw(error)
    }
  }
}
