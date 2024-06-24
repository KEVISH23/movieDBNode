import { NextFunction, Request, Response} from "express";
import { controller,request,response,httpPost,httpGet, httpPut, httpDelete } from "inversify-express-utils";
import { MovieService } from "../service";
import { responseMessage, TYPES } from "../constants";
import { inject } from "inversify";
import {  IBOC, IGETCOLLECTIONDATA, IMOVIES, REQUSER } from "../interfaces";
import { compareRole, errorHandler } from "../utils";
import puppeteer,{Browser} from "puppeteer";
import { isValidObjectId } from "mongoose";

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
            const {actorName,directorName,producerName,releaseDateRange,budgetRange,search,genre,page,limit} = req.query
            const data:any = await this.movieService.getMovies({role,_id,email},{
                actorName:actorName?.toString(),
                directorName:directorName?.toString(),
                producerName:producerName?.toString(),
                releaseDateRange:releaseDateRange?.toString(),
                budgetRange:budgetRange?.toString(),
                search:search?.toString(),
                genre:genre?.toString(),
                page:page?page.toString():"1",
                limit:limit?limit.toString():"5"
            })
            res.json({status:true,data:data.data,metadata:data.metadata})
        }catch(err){ 
            const message:string = errorHandler(err)
            res.json({status:false,message})
        }
    }
    @httpGet('/getMovie/:id',TYPES.AuthMiddleware)
    async getMovieById(@request() req:REQUSER,@response() res:Response){
        try{
            const {id} = req.params
            const data:any = await this.movieService.getMovieById(id)
            if(data.length>0){
                res.json({status:true,message:"Data received",data})
            }else{
                throw new Error("not found")
            }

        }catch(err:any){
            const message:string = errorHandler(err)
            res.json({status:false,message})
        }
    }

    @httpPost('/addMovies',TYPES.AuthMiddleware,(req:REQUSER, res:Response ,next:NextFunction)=>{
            compareRole(req.user,["Admin","Producer"],res,next)
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
        compareRole(req.user,["Admin"],res,next)
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
        const {actorName,directorName,producerName,releaseDateRange,budgetRange,search,genre,collectionRange,getPdf} = req.query
        
            if(getPdf){
                const pdf:Buffer = await this.movieService.getPdf({role,_id,email},{
                    actorName:actorName?.toString(),
                    directorName:directorName?.toString(),
                    producerName:producerName?.toString(),
                    releaseDateRange:releaseDateRange?.toString(),
                    budgetRange:budgetRange?.toString(),
                    search:search?.toString(),
                    genre:genre?.toString(),
                    collectionRange:collectionRange?.toString(),
                })
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename="example.pdf"');
                res.send(pdf);
            }else{
                const data:IGETCOLLECTIONDATA[] = await this.movieService.getCollection({role,_id,email},{
                    actorName:actorName?.toString(),
                    directorName:directorName?.toString(),
                    producerName:producerName?.toString(),
                    releaseDateRange:releaseDateRange?.toString(),
                    budgetRange:budgetRange?.toString(),
                    search:search?.toString(),
                    genre:genre?.toString(),
                    collectionRange:collectionRange?.toString(),
                })
                res.json({status:true,data})
            }
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

    @httpPut('/update/:id',TYPES.AuthMiddleware,(req:REQUSER, res:Response ,next:NextFunction)=>{
        compareRole(req.user,["Admin","Producer"],res,next)
     })
    async updateMovie(@request() req: REQUSER, @response() res: Response):Promise<void>{
        try {
            const {id} = req.params
            if(!id){
                throw new Error(responseMessage.IDNOTPROVIDED)
            }
            if(!isValidObjectId(id)){
                throw new Error(responseMessage.IDNOTVALID)
            }
            const {movieName,cast,producer,director,budget,genre,releaseDate} = req.body
            const data = {
                ...{movieName,cast,producer,director,budget,genre,releaseDate},
                _id:id
            }
            await this.movieService.updateMovieService(data)
            res.json({status:true,message:"Movie updated"})
        } catch (error:any) {
            const message:string = errorHandler(error)
            res.json({status:false,message})
        }
    }
    @httpDelete('/delete/:id',TYPES.AuthMiddleware,(req:REQUSER, res:Response ,next:NextFunction)=>{
        compareRole(req.user,["Admin","Producer"],res,next)
     })
    async deleteMovie(@request() req: REQUSER, @response() res: Response):Promise<void>{
        try {
            const {id} = req.params
            if(!id){
                throw new Error(responseMessage.IDNOTPROVIDED)
            }
            if(!isValidObjectId(id)){
                throw new Error(responseMessage.IDNOTVALID)
            }
            
            await this.movieService.deleteMovieService(id.toString())
            res.json({status:true,message:"Movie Deleted"})
        } catch (error:any) {
            const message:string = errorHandler(error)
            res.json({status:false,message})
        }
    }
}