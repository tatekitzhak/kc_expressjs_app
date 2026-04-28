import { Request, Response, NextFunction } from 'express';
import { Database } from './database.js';
import { queryAggregationPipeline } from './aggregationpipeline.js';

export class DatabaseService extends Database {
  private collection?: Record<string, string>;
  constructor(uri: string, dbName?: string, collection?: Record<string, string>) {
    super(uri, dbName);

    this.collection = collection;
  }

  // is database exists
  async isDatabaseExists(mongoclient: any, dbName?: string): Promise<boolean> {
    const arrayOfDatabases = await this.listOfDatabases(mongoclient);
    return dbName ? arrayOfDatabases.includes(dbName) : false;
  }

  async aggregateFromCategory() {
/* 
    const pipe_to_subcategories = [
      {
        $lookup: {
          from: subcategoryBlog,
          localField: "subcategory_ref_ids",
          foreignField: "_id",
          as: "blogSubcategory"
        }
      },
      {
        $unwind: {
          path: "$blogSubcategory",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          "_id": {
            _id: "$_id",
            title: "$title",
            description: "$description"
          },
          "blogSubcategory": { "$push": "$blogSubcategory" }
        }
      }
    ];
 */
  }

  async readFromDatabase(req: Request, res: Response, next: NextFunction) {

    try {

      let subcategoryBlog: string = '';

      if (this.collection) {
        subcategoryBlog = this.collection['subcategoryBlog']
      } else {
        console.log('collection is undefined');
      }


    /*   
      const pipe_to_subcategories = [
        {
          $lookup: {
            from: subcategoryBlog,
            localField: "subcategory_ref_ids",
            foreignField: "_id",
            // let: { customer_id: "$_id" }, // Define the local variable to use in the pipeline
            pipeline: [
              // { $match: { $expr: { $eq: ["$customerId", "$$customer_id"] } } },
              { 
                $lookup: {
                from: "topic",
                localField: "topic_ref_ids",
                foreignField: "_id",
                as: "blogTopicPipeline"
              },
            },
              {
                $unwind: {
                  path: "$blogTopicPipeline",
                  preserveNullAndEmptyArrays: true
                }
              },
              {
                $group: {
                  "_id": {
                    _id: "$_id",
                    title: "$title",
                    description: "$description"
                  },
                  "blogTopicPipeline": { "$push": "$blogTopicPipeline" }
                }
              }
            ],
            as: "blogSubcategory"
          }
        },
        {
          $unwind: {
            path: "$blogSubcategory",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            "_id": {
              _id: "$_id",
              title: "$title",
              description: "$description"
            },
            "blogSubcategory": { "$push": "$blogSubcategory" }
          }
        }
      ];
      
 */
    
      const blogSubcategoryAggregatePipeline = queryAggregationPipeline(subcategoryBlog)

      const { mongoclient, mongoclientDbPing } = await this.connectToDatabase(next);

      // if isDatabaseExists false, next new Error message 
      if (!await this.isDatabaseExists(mongoclient, this.db_name)) {
        next(new Error(`Internal server error: missing something: ${this.db_name}`));
      }

      const db = mongoclient.db(this.db_name);
      // console.log('isDatabaseExists:', await this.isDatabaseExists(mongoclient, this.db_name))
      const collections = await db.collection("category").aggregate(blogSubcategoryAggregatePipeline).toArray()

      console.log('ping_res:', mongoclientDbPing)
      // console.log('collections::', collections)

      return collections;

    } catch (error) {
      console.error(`No URI available for MongoDB connection: ${error}`);
      next(new Error(`Internal server error: We're missing something:`));

    }
    finally {
      // console.log("Database connection closed");
    }

  }


  // async findAllBlogs(): Promise<T[]> {
  //   return this.model.find().exec();
  // }

  // async findBlogById(id: string): Promise<T | null> {
  //   return this.model.findById(id).exec();
  // }
}

// const dbService = new DatabaseService('mongodb://localhost:27017');