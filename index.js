const express = require("express");
const app = express();
const path = require("path");

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;


// Serve all static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Optional: any additional route
app.get("/hello", (req, res) => {
  res.send("This is the hello response");
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let collection; // store collection globally

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("Showdown");
    collection = database.collection("Event Stats");

    app.get("/api/events", async (req, res) => {
      try {
        const data = await collection.find({}).toArray();
        res.json(data);
      } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
      }
    });

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });

  } catch (err) {
    console.error(err);
  }
}

startServer();