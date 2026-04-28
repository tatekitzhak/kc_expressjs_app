import { Request, Response, RequestHandler, NextFunction } from 'express';

import { DatabaseService } from '../db/databaseService.js';
import * as database from "../blogs/blogs.database.js";
import { UnitUser, EnumServiceGetOrderBy } from "../blogs/blog.interface.js";
import { ConnectionConfig } from "../config/auth.config.js";


interface CustomRequest extends Request {
    request_data?: any;
    requestInfo?: any;
}

interface  CustomCollection {
    [key: string]: string;
}

let uri = ConnectionConfig.db['uri'] as string;
let dbName = ConnectionConfig.db['dbName'] as string;
let collections = ConnectionConfig.db['collection'] as CustomCollection;

export class BlogController {

    static async getBlog(req: Request, res: Response, next: NextFunction) {
        const getUrlQueryParametersForClient = (req as CustomRequest).requestInfo;

        try {

            const dbServiceInstance = new DatabaseService(uri, dbName, collections);

            const categoryCollections = await dbServiceInstance.readFromDatabase(req, res, next);

            res.status(200).json({
                data: categoryCollections,
                clientInfo: getUrlQueryParametersForClient
            });


        } catch (error) {
            console.error("Database connection error:1:", error);
            next(new Error(`No URI available for MongoDB connection:1: ${error}`));

        }

    }

    public getAllBlogs: RequestHandler = async (req: Request, res: Response) => {

        try {
            const allBlogs: UnitUser[] = await database.findAll();
            console.log('allBlogs:', allBlogs)
            if (!allBlogs.length) {
                return res.status(400).json({ msg: `No allBlogs at this time..` })
            }

            return res.status(200).json({
                status: 'status',
                message: 'class BlogController',
                data: 'Data',
                total_blogs: allBlogs.length,
                allBlogs
            })

        } catch (error) {
            return res.status(500).json({ error })
        }
    };

    public getFavourites: RequestHandler = async (req: Request, res: Response) => {

        try {
            // simulate the time to retrieve the user list
            await new Promise((resolve) => setTimeout(resolve, 250));
            const allBlogs: EnumServiceGetOrderBy | null = await database.findAllFavourites('34abc567');
            console.log('allBlogs:', allBlogs)
            if (!allBlogs) {
                return res.status(400).json({ msg: `No allBlogs at this time..` })
            }

            return res.status(200).json({
                status: 'status',
                message: 'class BlogController',
                data: 'Data',
                total_blogs: allBlogs,
                allBlogs
            })

        } catch (error) {
            return res.status(500).json({ error })
        }

    };

    static async createBlog(req: Request, res: Response) {
       
    }

    static async updateBlog(req: Request, res: Response) {
        
    }

    static async deleteBlog(req: Request, res: Response) {
        
    }
}

export const blogController = new BlogController();