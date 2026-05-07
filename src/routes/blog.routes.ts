import express, { Application, Request, Response, NextFunction, type Router } from 'express';

import { blogController, BlogController } from "../controllers/blog.controller.js";
import { getUrlQueryParametersForClient } from "../middleware/handleUrlQueryParametersForClient.js";

export const blogsRouter: Router = express.Router()

blogsRouter.route("/db_ping").get(function (req, res, next) {
    getUrlQueryParametersForClient(req, res, next, 'Getting URL Query Parameters for client')
}, 
    blogController.getDBPing );

blogsRouter.route('/people').get(function (req, res, next) {
    getUrlQueryParametersForClient(req, res, next, 'Getting URL Query Parameters for client')
},
BlogController.getBlog);


blogsRouter.get("/favourites", blogController.getFavourites);