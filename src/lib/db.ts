import mongoose from "mongoose";

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

if(!MONGODB_URI)        // check if env var is present
    throw new Error("MongoDB URI doesn't exist");

type MongooseCache = {
    conn: typeof mongoose | null;              // the active db connection
    promise: Promise<typeof mongoose> | null; // pending or in-progress connection
};

declare global {                // attach cache object to global environment
    var mongooseConnection: MongooseCache | undefined; // var because TypeScript's rules for modifying the global scope require it
}

const cached: MongooseCache = global.mongooseConnection || { conn: null, promise: null }; // get the cached connection from global
                                                                                        // fall back to default setup, if cache miss
if (!global.mongooseConnection) {
    global.mongooseConnection = cached; // declare the cache object with null values, if it's not present
}

async function connectDB(): Promise<typeof mongoose> {
    if(cached.conn)         // return the cached connection, if cache hit
        return cached.conn;

    if(!cached.promise) { //If there is no active connection (!cached.conn) and no one is currently
        // trying to connect (!cached.promise), we start the connection process
        const options = {
            bufferCommands: false,
            maxPoolSize: 10,
        };

        //store the pending Promise, not the result.
        // We also use .then() to return the mongoose instance when the promise resolves.
        cached.promise = mongoose.connect(MONGODB_URI!, options).then((mongoose) => {
            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise; // wait for connection to establish
    }
    catch(error) {
        console.error(error);
        cached.promise = null; // FIX: Reset the promise so we can try again on the next request
        throw error;
    }
    return cached.conn;
}

export default connectDB;