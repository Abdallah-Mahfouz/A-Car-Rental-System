import { MongoClient } from "mongodb";

//================================================
// Connection URL
const client = new MongoClient("mongodb://127.0.0.1:27017");

client
  .connect()
  .then(() => {
    console.log("Connected successfully to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });
//================================================

const db = client.db("online");

export default db;
