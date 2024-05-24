import { PipelineStage } from "mongoose";

export const getMoviesPipeline:PipelineStage[] = [
    {
      $lookup: {
        from: "users",
        localField: "director",
        foreignField: "_id",
        as: "director"
      }
    },{
      $lookup: {
        from: "users",
        localField: "cast",
        foreignField: "_id",
        as: "cast"
      }
    },{
      $lookup: {
        from: "users",
        localField: "producer",
        foreignField: "_id",
        as: "producer"
      }
    },{
      $lookup: {
        from: "genres",
        localField: "genre",
        foreignField: "_id",
        as: "genre"
      }
    },{
      $addFields: {
        directorName: "$director.name",
        actorName:"$cast.name",
        producerName:"$producer.name",
        genre:"$genre.genreName"
      }
    }
  ]


  export const bocTemp:PipelineStage[]=[
    {
      $lookup: {
        from: "movies",
        localField: "movieId",
        foreignField: "_id",
        as: "result",
        pipeline:[
          {
            $lookup:{
              from: "users",
              localField: "result.director",
              foreignField: "_id",
              as: "director"
            }
          }
        ]
      }
    }
  ]

  export const getCollectionPipeline:PipelineStage[] = [
    {
      $lookup: {
        from: "movies",
        localField: "movieId",
        foreignField: "_id",
        as: "result",
      }
    },
    {
        $lookup: {
          from: "users",
          localField: "result.director",
          foreignField: "_id",
          as: "director"
        }
      },{
        $lookup: {
          from: "users",
          localField: "result.cast",
          foreignField: "_id",
          as: "cast"
        }
      },{
        $lookup: {
          from: "users",
          localField: "result.producer",
          foreignField: "_id",
          as: "producer"
        }
      },{
        $lookup: {
          from: "genres",
          localField: "result.genre",
          foreignField: "_id",
          as: "genre"
        }
      },{
        $addFields: {
          directorName: "$director.name",
          actorName:"$cast.name",
          producerName:"$producer.name",
          budget:{$arrayElemAt:["$result.budget",0]},
          movieName:{$arrayElemAt:["$result.movieName",0]},
          genre:"$genre.genreName",
          recovered:{$multiply:[{$divide:[{$abs:{$subtract:[{$arrayElemAt:["$result.budget",0]},"$boxOfficecollection"]}},{$arrayElemAt:["$result.budget",0]}]},100]}
        }
      },{
        $addFields: {
          recovered: {
            $cond:[
              { $gte: [ "$boxOfficecollection", "$budget" ] }
              ,
              {$concat:["+",{$toString:"$recovered"},"%"]},{$concat:["-",{$toString:"$recovered"},"%"]}]}
        }
      }
  ]


  const dafodPipeline:PipelineStage[] = [
    {
      $lookup: {
        from: "movies",
        localField: "movieId",
        foreignField: "_id",
        as: "result",
      }
    },
    {
        $lookup: {
          from: "users",
          localField: "result.director",
          foreignField: "_id",
          as: "director"
        }
      },{
        $lookup: {
          from: "users",
          localField: "result.cast",
          foreignField: "_id",
          as: "cast"
        }
      },{
        $lookup: {
          from: "users",
          localField: "result.producer",
          foreignField: "_id",
          as: "producer"
        }
      },{
        $lookup: {
          from: "genres",
          localField: "result.genre",
          foreignField: "_id",
          as: "genre"
        }
      },{
        $addFields: {
          directorName: "$director.name",
          actorName:"$cast.name",
          producerName:"$producer.name",
          budget:{$arrayElemAt:["$result.budget",0]},
          movieName:{$arrayElemAt:["$result.movieName",0]},
          genreName:"$genre.genreName",
          //aama dafodgiri kari me 😁
          recover:{$multiply:[{$divide:[{$subtract:["$boxOfficecollection",{$arrayElemAt:["$result.budget",0]}]},"$boxOfficecollection"]},100]}
        }
      }
    // ,{
      //         $project:{
      //           directorName:1,
      //           actorName:1,
      //           producerName:1,
      //           movieName:1,
      //           releaseDate:1,
      //           _id:1,
      //           budget:1,
      //           boxOfficecollection:1
      //         }
      //       }
  ]

  const okaayWithPercentage:PipelineStage[] = [
    {
      $lookup: {
        from: "movies",
        localField: "movieId",
        foreignField: "_id",
        as: "result",
      }
    },
    {
        $lookup: {
          from: "users",
          localField: "result.director",
          foreignField: "_id",
          as: "director"
        }
      },{
        $lookup: {
          from: "users",
          localField: "result.cast",
          foreignField: "_id",
          as: "cast"
        }
      },{
        $lookup: {
          from: "users",
          localField: "result.producer",
          foreignField: "_id",
          as: "producer"
        }
      },{
        $lookup: {
          from: "genres",
          localField: "result.genre",
          foreignField: "_id",
          as: "genre"
        }
      },{
        $addFields: {
          directorName: "$director.name",
          actorName:"$cast.name",
          producerName:"$producer.name",
          budget:{$arrayElemAt:["$result.budget",0]},
          movieName:{$arrayElemAt:["$result.movieName",0]},
          genreName:"$genre.genreName",
          recovered:{$multiply:[{$divide:[{$abs:{$subtract:[{$arrayElemAt:["$result.budget",0]},"$boxOfficecollection"]}},{$arrayElemAt:["$result.budget",0]}]},100]}
        }
      }
    ,{
      $addFields: {
        recovered: {
          $cond:[
            { $gte: [ "$boxOfficecollection", "$budget" ] }
            ,
            {$concat:["+",{$toString:"$recovered"},"%"]},{$concat:["-",{$toString:"$recovered"},"%"]}]}
      }
    }
    // ,{
      //         $project:{
      //           directorName:1,
      //           actorName:1,
      //           producerName:1,
      //           movieName:1,
      //           releaseDate:1,
      //           _id:1,
      //           budget:1,
      //           boxOfficecollection:1
      //         }
      //       }
  ]