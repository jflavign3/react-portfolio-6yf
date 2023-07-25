//var co = require('co');
//var mongoose = require('mongoose');
const {MongoClient} = require("mongodb");
require('dotenv').config(); //facilitates for windows users


const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

const handler = async (event) => {
    try{
      /*  const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
        console.log(database);
        const collection = database.collection(process.env.MONGODB_COLLECTION);
        const results = await collection.find({}).limit(10).toArray();
        return {
          statusCode:200,
          body: JSON.stringify(results),
        }*/
        return {
          statusCode:200,
          body: "allo",
        }

    }catch(error){
        return {statusCode: 500, body: error.toString()};
    }
}

