
export interface IGETMOVIES{
    actorName:string|undefined,
    directorName:string|undefined,
    producerName:string|undefined,
    releaseDateRange:string|undefined,
    budgetRange:string|undefined,
    search:string|undefined,
    genre:string|undefined
}

export interface IGETCOLLECTION extends IGETMOVIES{
    collectionRange:string|undefined,
}

export interface IGETCOLLECTIONDATA {
    _id:string,
    boxOfficecollection:number,
    directorName:string[],
    actorName:string[],
    producerName:string[],
    budget:number,
    movieName:string,
    genreName:string[],
    recovered:number,
    verdict:string
}