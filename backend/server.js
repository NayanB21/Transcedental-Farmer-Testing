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
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://transcedental-farmer-testing.vercel.app/"   
  ],
  credentials: true
}));


app.use(express.json());


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



mongoose
.connect(
  process.env.MONGO_URI
)
.then(async () => {

  console.log(
    "MongoDB Connected"
  );

  await initializeEE();

  app.listen(

    process.env.PORT,

    () => {

      console.log(
        "Server Running"
      );

    }

  );

})
.catch(err => {

  console.error(err);

});