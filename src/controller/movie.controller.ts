import { NextFunction, Request, Response} from "express";
import { controller,request,response,httpPost,httpGet } from "inversify-express-utils";
import { MovieService } from "../service";
import { responseMessage, TYPES } from "../constants";
import { inject } from "inversify";
import {  IBOC, IMOVIES, REQUSER } from "../interfaces";
import { compareRole, errorHandler } from "../utils";
import puppeteer,{Browser} from "puppeteer";

// @controller('/movies',TYPES.AuthMiddleware,(req:REQUSER, res:Response ,next:NextFunction)=>{
//     compareRole(req.user,"Admin",res,next)
// })


@controller('/movies')
export class MovieController{

    constructor(
        @inject<MovieService>(TYPES.MovieService) private movieService:MovieService
    ){}

    @httpGet('/',TYPES.AuthMiddleware)
    async getMovies(@request() req:REQUSER,@response() res:Response):Promise<void>{
        try{
            const {role,_id,email} = req.user
            const {actorName,directorName,producerName,releaseDateRange,budgetRange,search,genre} = req.query
            const data:IMOVIES[] = await this.movieService.getMovies({role,_id,email},{
                actorName:actorName?.toString(),
                directorName:directorName?.toString(),
                producerName:producerName?.toString(),
                releaseDateRange:releaseDateRange?.toString(),
                budgetRange:budgetRange?.toString(),
                search:search?.toString(),
                genre:genre?.toString()
            })
            res.json({status:true,data})
        }catch(err){ 
            const message:string = errorHandler(err)
            res.json({status:false,message})
        }
    }


    @httpPost('/addMovies',TYPES.AuthMiddleware,(req:REQUSER, res:Response ,next:NextFunction)=>{
            compareRole(req.user,"Admin",res,next)
         })
    async addMovies(@request() req:REQUSER,@response() res:Response):Promise<void>{
        try {
            const {movieName,cast,producer,genre,director,releaseDate,budget} = req.body
            await this.movieService.addMovies({movieName,cast,producer,genre,director,releaseDate,budget})
            res.json({status:true,message:responseMessage.MOVIECREATED})
        } catch (err) {
            const message:string = errorHandler(err)
            res.json({status:false,message})
        }
    }

    @httpPost('/addCollection',TYPES.AuthMiddleware,(req:REQUSER, res:Response ,next:NextFunction)=>{
        compareRole(req.user,"Admin",res,next)
     })
     async addCollection(@request() req:REQUSER,@response() res:Response):Promise<void>{
        try {
            const {movieId,boxOfficecollection} = req.body
            await this.movieService.addCollectionService({movieId,boxOfficecollection})
            res.json({status:true,message:responseMessage.COLLECTADDED})
        } catch (err) {
            const message:string = errorHandler(err)
            res.json({status:false,message})
        }
     }

     @httpGet('/getCollection',TYPES.AuthMiddleware)
     async getCollection(@request() req:REQUSER,@response() res:Response):Promise<void>{
        try {    
                                                                                                                                                                              const {role,_id,email} = req.user
        const {actorName,directorName,producerName,releaseDateRange,budgetRange,search,genre,collectionRange} = req.query                                                                                                  
            const data:IBOC[] = await this.movieService.getCollection({role,_id,email},{
                actorName:actorName?.toString(),
                directorName:directorName?.toString(),
                producerName:producerName?.toString(),
                releaseDateRange:releaseDateRange?.toString(),
                budgetRange:budgetRange?.toString(),
                search:search?.toString(),
                genre:genre?.toString(),
                collectionRange:collectionRange?.toString()
            })
            res.json({status:true,data})
        } catch (error:any) {
            const message:string = errorHandler(error)
            res.json({status:false,message})
        }
     }
     @httpGet('/getPdf')
     async getPdf(@request() req: REQUSER, @response() res: Response): Promise<void> {
        
        try {
            const htmlString = `<table>
                <thead>
                    <tr>
                        <th>Column 1</th>
                        <th>Column 2</th>
                        <th>Column 3</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Row 1, Cell 1</td>
                        <td>Row 1, Cell 2</td>
                        <td>Row 1, Cell 3</td>
                    </tr>
                    <tr>
                        <td>Row 2, Cell 1</td>
                        <td>Row 2, Cell 2</td>
                        <td>Row 2, Cell 3</td>
                    </tr>
                    <tr>
                        <td>Row 3, Cell 1</td>
                        <td>Row 3, Cell 2</td>
                        <td>Row 3, Cell 3</td>
                    </tr>
                </tbody>
            </table>`;
    
            const browser = await puppeteer.launch(
                {
                  headless: true,
                //   slowMo: 50,
                  args: ['--no-sandbox', '--disable-setuid-sandbox'],
                //   timeout: 60000,
              }
              );
            let page = await browser.newPage();
    
            await page.setContent(htmlString);
    
            // await page.emulateMediaType('screen');
    
            const pdf = await page.pdf({
                path: 'result.pdf',
                margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
                printBackground: true,
                format: 'A4',
            });

    
            await browser.close()
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="example.pdf"');
            res.send(pdf);
        } catch (error) {
            console.error('Error generating PDF:', error);
            // Handle error response
            res.status(500).send('Error generating PDF');
        }

        // const pdfBuffer  = await generatePdf("<h1>helloworld</h1>")
        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', 'inline; filename=generated.pdf');
        // res.send(pdfBuffer);
    }

    
    
}