import { Container } from "inversify";
import { UserController } from "./controller";
import { TYPES } from "./constants/";
import { MovieService, UserService } from "./service";
import { AuthMiddleware } from "./middlewares";
import { GenreService } from "./service/genre.service";

const container = new Container()
//services
container.bind<UserService>(TYPES.UserService).to(UserService)
container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware)
container.bind<MovieService>(TYPES.MovieService).to(MovieService)
container.bind<GenreService>(TYPES.GenreService).to(GenreService)
export {container}