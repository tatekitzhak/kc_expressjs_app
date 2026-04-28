import express, { Application, Request, Response, NextFunction, type Router } from 'express';

import { blogController, BlogController } from "../controllers/blog.controller.js";
import { RedisSetOptions } from "../blogs/blog.interface.js";
import { getUrlQueryParametersForClient } from "../middleware/handleUrlQueryParametersForClient.js"

export const blogsRouter: Router = express.Router()

function redisCachingMiddleware(abc: any): any {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log('redisCachingMiddleware::', abc)
        next()
    }
}

const redisCachingOptions: RedisSetOptions = {
    options: {
        EX: 43200, // 12h
        NX: false, // write the data even if the key already exists
    },
}

interface ClientInfo {
    [key: string]: any;
    url: string;
    message: string;
}

interface CustomRequest extends Request {
    requestInfo?: ClientInfo;
}


blogsRouter.get(
    "/blog",
    // authentification,
    // authorization(["admin"]),
    BlogController.getBlog
);

blogsRouter.get("/redis",
    redisCachingMiddleware(redisCachingOptions),
    blogController.getAllBlogs);


blogsRouter.route('/blogs').get(function (req, res, next) {
    getUrlQueryParametersForClient(req, res, next, 'Getting URL Query Parameters for client')
},
BlogController.getBlog);


blogsRouter.get("/favourites", blogController.getFavourites);