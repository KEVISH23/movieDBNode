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
          genreName:"$genre.genreName",
          recovered:{$multiply:[{$divide:[{
            
              $subtract:[
                "$boxOfficecollection",
                {$arrayElemAt:["$result.budget",0]},
              ]
            
          },
          {$arrayElemAt:["$result.budget",0]}]},100]}
        }
      },
 {
   $addFields: {
     verdict: {
       $switch:{
         branches:[
            { case: { $lte: ["$recovered", 0] }, then: "Flop" },
            { case: { $lte: ["$recovered", 20] }, then: "Average" },
            { case: { $lte: ["$recovered", 50] }, then: "Hit" },
            { case: { $lte: ["$recovered", 100] }, then: "Super Hit" },
         ],
         default:"BlockBuster"
       }
     }
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
          recovered:{$multiply:[{$divide:[{
            
              $subtract:[
                "$boxOfficecollection",
                {$arrayElemAt:["$result.budget",0]},
              ]
            
          },
          {$arrayElemAt:["$result.budget",0]}]},100]}
        }
      },
 {
   $addFields: {
     verdict: {
       $switch:{
         branches:[
            { case: { $lte: ["$recovered", 0] }, then: "Flop" },
            { case: { $lte: ["$recovered", 20] }, then: "Average" },
            { case: { $lte: ["$recovered", 50] }, then: "Hit" },
            { case: { $lte: ["$recovered", 100] }, then: "Super Hit" },
         ],
         default:"BlockBuster"
       }
     }
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


export const reviewPipeline:PipelineStage[] = [
  {
    $lookup: {
      from: "users",
      localField: "reviewer",
      foreignField: "_id",
      as: "user"
    }
  }
  ,{
    $lookup: {
      from: "movies",
      localField: "movieId",
      foreignField: "_id",
      as: "movie"
    }
  }
  ,{
    $group: {
      _id: "$movieId",
      avgRating: {
        $avg:"$ratings"
      },
      movieName:{$first:"$movie.movieName"},
      cast:{$first:"$movie.cast"},
      director:{$first:"$movie.director"},
      producer:{$first:"$movie.producer"},
      reviewId:{$first:"$_id"},
      reviewer:{$push:"$user.name"}
    }
  }
  ,{
    $lookup: {
      from: "users",
      localField: "director",
      foreignField: "_id",
      as: "director"
    }
  }
  ,{
   $unwind:"$producer" 
  }
  ,{
    $lookup: {
      from: "users",
      localField: "producer",
      foreignField: "_id",
      as: "producer"
    }
  }
  ,{
   $unwind:"$cast" 
  }
  ,{
    $lookup: {
      from: "users",
      localField: "cast",
      foreignField: "_id",
      as: "cast"
    }
  }
  ,{
    $project: {
      cast:"$cast.name",
      producer:"$producer.name",
      director:"$director.name",
      movieName:1,
      avgRating:1,
      reviewer:1,
      reviewId:1
    }
  }
]