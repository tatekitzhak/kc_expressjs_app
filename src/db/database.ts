import { Collection, Db, Document, MongoClient } from "mongodb";
// const { DatabaseConnectionError } = require('../utils/errorHandler/DatabaseError');
import { Request, Response, NextFunction } from 'express';

export class Database {
  private readonly URI: string;
  public db_name?: string;
  public dbClient: any;

  constructor(uri: string, dbName?: string) {
    this.URI = `${uri}`
    this.db_name = dbName;
    // this.name = this.constructor.name;
    // this.client = ''
    console.log('Database URI:', this.URI)
  }

  // list of databases
  async listOfDatabases(db_client: any): Promise<string[]> {
    try {
      let arrayOfDatabases: string[] = [];

      interface DatabaseInfo {
        name: string;
        sizeOnDisk: number;
        empty: boolean;
      }

      interface DatabasesList {
        databases: DatabaseInfo[];
      }

      const databasesList: DatabasesList = await db_client.db().admin().listDatabases();
      console.log(` --- Databases:---- length: ${databasesList.databases.length}, `);
      databasesList.databases.forEach((db: DatabaseInfo) => {
        console.log(` --- name: ${db.name}, sizeOnDisk: ${db.sizeOnDisk}, empty: ${db.empty}`);
        arrayOfDatabases.push(db.name);
      });
      return arrayOfDatabases;
    } catch (error) {
      console.error(`Error listing databases: ${error}`);
      const err = error as Error;
      throw new Error(err.message ?? err.toString());
    }
  };

  async connectToDatabase(next: NextFunction ): Promise<{ mongoclient: MongoClient, mongoclientDbPing: object, next?: NextFunction }> {
    // check for database connection string and db name
    if (!this.URI || !this.db_name) {
      // throw new Error(`No URI available for MongoDB connection: ${this.URI}`);
      next( new Error(`No URI available for MongoDB connection: ${this.URI}`));
    }

    try {
      const mongoclient = await MongoClient.connect(this.URI);
      this.dbClient = mongoclient;

      // Establish and verify a MongoDB server connection: Send a ping to confirm a successful connection
      const mongoclientDbPing = await mongoclient.db().admin().ping(); // await mongoclient.db().admin().command({ ping: 1 });

      console.log('MongoDB server connection successful, ping:', mongoclientDbPing);

      // connect to specific database
      const db = await mongoclient.db(this.db_name);

      console.log(`Database connection success. Connection name: '${mongoclient}' Database name: '${db.databaseName}'`);
      return { mongoclient, mongoclientDbPing };
      
    } catch (error: any) {

      if (process.env.NODE_ENV === "development") {
        console.error('\x1b[36m', `Error establishing a database connection`, '\x1b[0m', JSON.stringify(error));

        console.log('\x1b[36m', `Error Type:`, '\x1b[0m', error.name); // Error Type: in this case just Error
        console.log('\x1b[36m', ' Error Message:', '\x1b[0m', error.message); // Error Message: The string we’ve passed as an argument to the error constructor in the try block
        console.log('\x1b[36m', 'Error Stack: ', '\x1b[0m', error.stack)
      }

      throw new Error(error?.message ?? error.toString());
    }
  }

  //   async disconnect() {
  //     try {
  //       await this.client.close();
  //       console.log('Database connection closed');
  //     } catch (error) {
  //       console.error(`Error closing database connection: ${error}`);
  //     }
  //   }

  //   async listDatabases(client) {
  //     const databasesList = await client.db().admin().listDatabases();
  //     let arrayOfDatabases = [];
  //     console.log("--- Databases:-----");
  //     await databasesList.databases.forEach((db) => {
  //       console.log(` - ${db.name}`)
  //       arrayOfDatabases.push(db.name)
  //     });
  //     return arrayOfDatabases;
  //   };
}

// export const Database_ = new Database('mongodb://localhost:27017');