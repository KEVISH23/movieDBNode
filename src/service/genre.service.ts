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
}