require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI;

// Fail fast if MONGO_URI is missing
if (!uri) {
  console.error("ERROR: MONGO_URI is undefined. Set it in your .env or Render environment variables.");
  process.exit(1);
}

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Example route
app.get("/hello", (req, res) => {
  res.send("This is the hello response");
});

// Health check for Render
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// MongoDB client

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tls: true,
  tlsAllowInvalidCertificates: false,
  secureContext: {
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT
  }
});

let collection; // store collection globally

async function startServer() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("Showdown");
    collection = database.collection("EventStats"); // avoid spaces in collection name

    // API route
    app.get("/api/events", async (req, res) => {
      try {
        const data = await collection.find({}).toArray();
        res.json(data);
      } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
      }
    });

    // Start the server **once** with dynamic port
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

startServer();
