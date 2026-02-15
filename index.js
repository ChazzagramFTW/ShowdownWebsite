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

app.get('/stats', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'eventstats.html'));
});

app.get('/news', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'article.html'));
});

app.get('/lads', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'eventstats.html'));
});

app.get('/player/:name', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'player.html'));
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
});

let collection; // store collection globally

async function startServer() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("Showdown");
    collection = database.collection("Event Stats"); // avoid spaces in collection name

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

    app.get("/api/player/:name", async (req, res) => {
    const playerName = req.params.name;

    try {
      // Fetch all events from MongoDB
      const events = await collection.find({}).toArray();

      const eventsPlayed = [];

      events.forEach(season => {
        if (Array.isArray(season.player_leaderboard)) {
          // Sort players by points descending
          const sortedPlayers = [...season.player_leaderboard].sort(
            (a, b) => b.points - a.points
          );

          // Find this player
          const index = sortedPlayers.findIndex(
            player => player.player_name == playerName
          );

          if (index !== -1) {
            const playerEntry = sortedPlayers[index];

            eventsPlayed.push({
              season_name: season.season_name,
              team: playerEntry.team,
              placement: index + 1,
              points: playerEntry.points
            });
          }
        }
      });

      // Return result
      res.json({
        player: playerName,
        total_events: eventsPlayed.length,
        events: eventsPlayed
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Database error" });
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
