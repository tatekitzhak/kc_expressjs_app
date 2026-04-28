import { Collection, Db, Document, MongoClient } from "mongodb";
import { ConnectionConfig } from "../config/auth.config.js";
// import Database from "./database";

// get environment variables for database uri and database name

let uri: string = ConnectionConfig.db['uri'] as string;
let dbName = process.env.MONGODB_DB;

// create cache variables so we can cache our connection
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let collections: Record<string, Collection<Document>> | null = null;
// database connection function

async function connectToDatabase(): Promise<{
  mongoclient: MongoClient;
  db: Db;
  collections: Record<string, Collection<Document>>;
}> {
  // check for database connection string and db name
  if (!uri || !dbName) {
    throw new Error(`No URI available for MongoDB connection: ${uri}`);
  }
  // if have cached use it
  if (cachedClient && cachedDb && collections) {
    console.log("Using cached database connection:", cachedDb.databaseName);
    return { mongoclient: cachedClient, db: cachedDb, collections };
  }

  try {
    const mongoclient = await MongoClient.connect(uri);

    // Establish and verify a MongoDB server connection: Send a ping to confirm a successful connection
    const ping_res = await mongoclient.db().admin().ping(); // await mongoclient.db().admin().command({ ping: 1 });

    console.log('MongoDB server connection successful, ping:', ping_res);

    // connect to specific database
    const db = await mongoclient.db(dbName);
    // set cache
    cachedClient = mongoclient;
    cachedDb = db;
    collections = { category: db.collection("category") };

    db.collection("category").find({}).toArray().then((data) => {
      // console.log("Data::", data);
    });

    console.log(`Database connection success. Connection name: '${mongoclient}' Database name: '${db.databaseName}'`);
    return { mongoclient, db, collections };
  } catch (error: any) {
    throw new Error(error?.message ?? error.toString());
  }
}

// connectToDatabase().then(({ client, db, collections }) => {
//   // console.log("Database connected::", db.databaseName);
//   // console.log("Collections::", collections);  
//   // do something with the database
//   // close the connection

// } ).catch((e) => {  
//   console.error("Database connection error:", e);
// } ).finally(() => { 
//   // client.close();
//   // console.log("Database connection closed");

//   });

export { connectToDatabase };