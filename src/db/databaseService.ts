import { Request, Response, NextFunction } from 'express';
import { Database } from './database.js';

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

  async readFromDatabase(req: Request, res: Response, next: NextFunction) {

    try {

      let subcategorypeople: string = '';

      if (this.collection) {
        subcategorypeople = 'people'
      } else {
        console.log('collection is undefined');
      }

      

      const { mongoclient, mongoclientDbPing } = await this.connectToDatabase();

      // if isDatabaseExists false, next new Error message 
      if (!await this.isDatabaseExists(mongoclient, this.db_name)) {
       return next(new Error(`Internal server error: missing something: ${this.db_name}`));
      }

      const db = mongoclient.db(this.db_name || 'mynodejsapp');
      
      const collection = db.collection("people");
      const collection_data = await collection.find({}).toArray();

      console.log('ping_res:', mongoclientDbPing)

      return collection_data;

    } catch (error) {
      console.error(`No URI available for MongoDB connection: ${error}`);
      return next(new Error(`Internal server error: We're missing something:`));

    }
    finally {
      // console.log("Database connection closed");
    }

  }

  async databasePing(req: Request, res: Response, next: NextFunction) {

    try {

      let subcategoryBlog: string = '';

      if (this.collection) {
        subcategoryBlog = 'people'
      } else {
        console.log('collection is undefined');
      }


      const { mongoclient, mongoclientDbPing } = await this.connectToDatabase();

      // if isDatabaseExists false, next new Error message 
      if (!await this.isDatabaseExists(mongoclient, this.db_name)) {
        return next(new Error(`Internal server error: missing something: ${this.db_name}`));
      }

      const db = mongoclient.db(this.db_name);
      console.log('ping_res:', mongoclientDbPing)
      // console.log('collections::', collections)

      return mongoclientDbPing;

    } catch (error) {
      console.error(`No URI available for MongoDB connection: ${error}`);
      return next(new Error(`Internal server error: We're missing something:`));

    }
    finally {
      // console.log("Database connection closed");
    }

  }


}
