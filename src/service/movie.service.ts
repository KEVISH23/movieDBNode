import { injectable } from "inversify";
import {
  DECODED,
  IBOC,
  IGETCOLLECTION,
  IGETCOLLECTIONDATA,
  IGETMOVIES,
  IMOVIES,
  IUSER,
  REQUSER,
} from "../interfaces";
import { BoxOffice, Movie } from "../models";
import { responseMessage } from "../constants";
import {
  getAndQuery,
  getCollectionPipeline,
  getMoviesPipeline,
  getOrQuery,
  roleBased,
} from "../utils";
import mongoose, { PipelineStage } from "mongoose";
import puppeteer from "puppeteer";
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
        genre,
      } = reqQuery;
      let query = {
        $match: {},
      };
      const roleWiseMatch = roleBased(reqUser);

      const releaseDateRangeArr: string[] | undefined =
        releaseDateRange?.split("/");
      const budgetRangeArr: String[] | undefined = budgetRange?.split("-");

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
      filteredArray.length > 0
        ? (query.$match = getAndQuery(filteredArray, query))
        : null;

      search
        ? (query.$match = getOrQuery(
            ["actorName", "producerName", "directorName", "movieName", "genre"],
            query,
            search
          ))
        : null;

      const pipeline: PipelineStage[] = [
        {
          $match: {
            ...roleWiseMatch,
          },
        },
        ...getMoviesPipeline,
        {
          $match: {
            ...query.$match,
          },
        },
        {
          $project: {
            directorName: 1,
            actorName: 1,
            producerName: 1,
            movieName: 1,
            releaseDate: 1,
            _id: 1,
            budget: 1,
            genre: 1,
          },
        },
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

  async addCollectionService(data: IBOC): Promise<void> {
    try {
      await BoxOffice.create(data);
    } catch (error) {
      throw error;
    }
  }

  async getCollection(
    reqUser: DECODED,
    reqQuery: IGETCOLLECTION
  ): Promise<IGETCOLLECTIONDATA[]> {
    try {
      const {
        actorName,
        directorName,
        producerName,
        releaseDateRange,
        budgetRange,
        search,
        genre,
        collectionRange,
      } = reqQuery;
      let query = {
        $match: {},
      };

      // console.log(reqUser)
      const roleWiseMatch = roleBased(reqUser, "collection");

      const releaseDateRangeArr: string[] | undefined =
        releaseDateRange?.split("/");
      const budgetRangeArr: String[] | undefined = budgetRange?.split("-");
      const collectionRangeArr: String[] | undefined =
        collectionRange?.split("-");

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
      filteredArray.length > 0
        ? (query.$match = getAndQuery(filteredArray, query))
        : null;

      search
        ? (query.$match = getOrQuery(
            ["actorName", "producerName", "directorName", "movieName", "genre"],
            query,
            search
          ))
        : null;

      const pipeline: PipelineStage[] = [
        ...getCollectionPipeline,
        {
          $match: {
            ...roleWiseMatch,
          },
        },
        {
          $match: {
            ...query.$match,
          },
        },
        {
          $project: {
            directorName: 1,
            actorName: 1,
            producerName: 1,
            movieName: 1,
            releaseDate: 1,
            _id: 1,
            budget: 1,
            boxOfficecollection: 1,
            genreName: 1,
            recovered: 1,
            verdict: 1,
          },
        },
      ];
      return await BoxOffice.aggregate(pipeline);
    } catch (error) {
      throw error;
    }
  }

  async getPdf(reqUser: DECODED, reqQuery: IGETCOLLECTION): Promise<Buffer> {
    try {
      const data: IGETCOLLECTIONDATA[] = await this.getCollection(
        reqUser,
        reqQuery
      );
      let htmlString = `
        <h1 style="text-align:center">Collection Details </h1>
      <table style="border:2px solid black;border-collapse:collapse">
                <thead>
                    <tr>
                        <th style="border:2px solid black">Movie name</th>
                        <th style="border:2px solid black">Cast</th>
                        <th style="border:2px solid black">Director</th>
                        <th style="border:2px solid black">Producer</th>
                        <th style="border:2px solid black">Budget</th>
                        <th style="border:2px solid black">Collection</th>
                        <th style="border:2px solid black">Verdict</th>
                        </tr>
                </thead>
                <tbody>`;

      data.forEach(
        (ele) =>
          (htmlString += `<tr>
                    <td style="border:2px solid black">${ele.movieName}</td>
                    <td style="border:2px solid black">${ele.actorName.join()}</td>
                    <td style="border:2px solid black">${ele.directorName.join()}</td>
                    <td style="border:2px solid black">${ele.producerName.join()}</td>
                    <td style="border:2px solid black">${ele.budget}</td>
                    <td style="border:2px solid black">${
                      ele.boxOfficecollection
                    }</td>
                    <td style="border:2px solid black">${ele.verdict}</td>
                  </tr>
                  `)
      );

      htmlString += `   
                </tbody>
            </table>`;

      const browser = await puppeteer.launch({
        headless: true,
        //   slowMo: 50,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        //   timeout: 60000,
      });
      let page = await browser.newPage();

      await page.setContent(htmlString);

      // await page.emulateMediaType('screen');

      const pdf = await page.pdf({
        path: "result.pdf",
        printBackground: true,
        format: "A4",
      });

      await browser.close();
      return pdf;
    } catch (error) {
      throw error;
    }
  }

  async updateMovieService(data:IMOVIES):Promise<void>{
    try {
      const {movieName,cast,producer,director,budget,genre,releaseDate} = data
      if(!movieName && !cast && !producer && !director && !budget && !genre && !releaseDate){
        throw new Error(responseMessage.MOVIEUPDATEFIELDS)
      }
      const isExist:IMOVIES|null = await Movie.findOne({_id:data._id})
      if(!isExist){
        throw new Error(responseMessage.MOVIENOTEXISTS)
      }
      await Movie.findByIdAndUpdate(data._id,data)
    } catch (error) {
      throw error
    }
  }

  async deleteMovieService(id:string):Promise<void>{
    try {
    
      const isExist:IMOVIES|null = await Movie.findOne({_id:id})
      if(!isExist){
        throw new Error(responseMessage.MOVIENOTEXISTS)
      }
      await Movie.findByIdAndDelete(id)
    } catch (error) {
      throw error
    }
  }

}
