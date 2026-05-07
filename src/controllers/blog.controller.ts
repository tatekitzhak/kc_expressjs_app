import { Request, Response, RequestHandler, NextFunction } from 'express';
import * as database from '../blogs/blogs.database.js'
import { DatabaseService } from '../db/databaseService.js';
import { ConnectionConfig } from "../config/auth.config.js";


interface CustomRequest extends Request {
    request_data?: any;
    requestInfo?: any;
}

interface CustomCollection {
    [key: string]: string;
}

// const uri1 = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mongo/${process.env.DB_NAME}?retryWrites=true&writeConcern=majority`;
// const uri1 = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mongo/${process.env.DB_NAME}?retryWrites=true&writeConcern=majority`;

// let uri = ConnectionConfig.db['uri'] as string;
// let dbName = ConnectionConfig.db['dbName'] as string;
// let collections = ConnectionConfig.db['collection'] as CustomCollection;

// let uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mongo/${process.env.DB_NAME}?retryWrites=true&writeConcern=majority`;
// let uri = 'mongodb://root:admin@mongo:27017/mynodejsapp?authSource=admin'
let uri = 'mongodb://root:admin@localhost:27017/mynodejsapp?authSource=admin'
let dbName = 'mynodejsapp';
let collections = ConnectionConfig.db['collection'] as CustomCollection;

export class BlogController {

    static async getBlog(req: Request, res: Response, next: NextFunction) {
        const getUrlQueryParametersForClient = (req as CustomRequest).requestInfo;

        try {

            const dbInstance = new DatabaseService(uri, dbName, collections);

            const people = await dbInstance.readFromDatabase(req, res, next);

            res.status(200).json({
                data_people: people,
                clientInfo: getUrlQueryParametersForClient
            });


        } catch (error) {
            console.error("Database connection error:1:", error);
            next(new Error(`No URI available for MongoDB connection:1: ${error}`));

        }

    }

    public getDBPing: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const getUrlQueryParametersForClient = (req as CustomRequest).requestInfo;

        try {

            const dbInstance = new DatabaseService(uri, dbName, collections);

            const pingInfo = await dbInstance.databasePing(req, res, next);

            return res.status(200).json({
                status: 'ok',
                DB_pingInfo: pingInfo,
                clientInfo: getUrlQueryParametersForClient
            });


        } catch (error) {
            console.error("Database connection error:1:", error);
            return next(new Error(`No URI available for MongoDB connection:1: ${error}`));

        }

    }


    public getFavourites: RequestHandler = async (req: Request, res: Response) => {

        try {
            // simulate the time to retrieve the user list
            await new Promise((resolve) => setTimeout(resolve, 250));
            const allBlogs: any | null = await database.findAllFavourites('34abc567');
            console.log('allBlogs:', allBlogs)
            if (!allBlogs) {
                return res.status(400).json({ msg: `No allBlogs at this time..` })
            }

            return res.status(200).json({
                status: 'ok',
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