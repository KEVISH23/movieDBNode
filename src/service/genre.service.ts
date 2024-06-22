import { injectable } from "inversify";
import { Genre } from "../models";

@injectable()
export class GenreService{
    async addGenreService(data:object):Promise<void>{
        try {
            await Genre.create(data)
        } catch (error) {
            throw(error)
        }
    }
    async getGenreService():Promise<any>{
        try {
            return await Genre.find({},{id:1,genreName:1})
        } catch (error) {
            throw(error)
        }
    }
}