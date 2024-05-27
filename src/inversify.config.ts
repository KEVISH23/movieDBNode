import { Container } from "inversify";
import { TYPES } from "./constants/";
import { MovieService, ReviewService, UserService } from "./service";
import { AuthMiddleware } from "./middlewares";
import { GenreService } from "./service/genre.service";

const container = new Container()
//services
container.bind<UserService>(TYPES.UserService).to(UserService)
container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware)
container.bind<MovieService>(TYPES.MovieService).to(MovieService)
container.bind<GenreService>(TYPES.GenreService).to(GenreService)
container.bind<ReviewService>(TYPES.ReviewService).to(ReviewService)
export {container}