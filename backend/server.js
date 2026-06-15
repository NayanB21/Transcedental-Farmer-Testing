const fs = require('fs');
const path = require('path');

if (process.env.GEE_KEY_JSON) {
  const dir = path.join(__dirname, 'config');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, 'gee-key.json'), process.env.GEE_KEY_JSON);
}


require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const farmRoutes =
 require("./routes/farmRoutes");
const userRoutes =
  require("./routes/userRoutes");
const analyticsRoutes =
  require("./routes/analyticsRoutes");
const chatRoutes =
  require("./routes/chatRoutes");
const chatHistoryRoutes =
  require("./routes/chatHistoryRoutes");
const timelineRoutes =
  require("./routes/timelineRoutes");

const reportRoutes =
  require("./routes/reportRoutes");
const yieldCacheRoutes =
  require("./routes/yieldCacheRoutes");

const {
  initializeEE
} = require(
  "./services/earthEngineService"
);


const app = express();

//the main/only 2 Middlewares 
app.use(cors()); // temporarily open — allows all origins while debugging


app.use(express.json());

// ── Health-check endpoint ─────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  const dbState = ["disconnected","connected","connecting","disconnecting"];
  res.json({
    status : "ok",
    server : "running",
    mongodb: dbState[mongoose.connection.readyState] || "unknown",
    time   : new Date().toISOString(),
  });
});
// ─────────────────────────────────────────────────────────────────────────────


app.use(
 "/api/users",
 userRoutes
);

app.use("/api/farms",farmRoutes);

app.use(
 "/api/chat",
 chatRoutes
);

app.use(
 "/api/analytics",
 analyticsRoutes
);

app.use(
 "/api/chats",
 chatHistoryRoutes
);

app.use(
 "/api/timeline",
 timelineRoutes
);



app.use(
 "/api/report",
 reportRoutes
);

app.use(
 "/api/yield-cache",
 yieldCacheRoutes
);



// ── Start server FIRST so Railway always gets a response on the port ──────────
// app.listen must NOT be inside mongoose.then() — if DB fails, server must
// still respond, otherwise Railway shows "Application failed to respond".
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

// ── Connect to MongoDB and Earth Engine in the background ────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    await initializeEE();
    console.log("Earth Engine Initialized");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err.message);
  });