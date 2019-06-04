const MongoClient = require("mongodb").MongoClient;

let db;

// TODO: Look up database pool connection
module.exports = {
  connect: MongoClient.connect(
    "mongodb://localhost:27017/Transactions",
    { useNewUrlParser: true },
    (err, client) => {
      if (err) throw err;

      db = client.db("Transactions");
      console.log("Connected to the Database");
    }
  ),

  get: () => {
    return db;
  }
};
