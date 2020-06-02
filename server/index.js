require("dotenv").config();
const express = require("express");
const session = require("express-session");
const massive = require("massive");
const authCTRL = require("./controllers/authController");
const treasureCTRL = require("./controllers/treasureController");
const auth = require("./middleware/authMiddleware");

const PORT = 4000;

const { SESSION_SECRET, CONNECTION_STRING } = process.env;

const app = express();

app.use(express.json());

massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
}).then((db) => {
  app.set("db", db);
  console.log("db connected");
});

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
  })
);

app.post("/auth/register", authCTRL.register);
app.post("/auth/login", authCTRL.login);
app.get("/auth/logout", authCTRL.logout);

app.get("/api/treasure/dragon", treasureCTRL.dragonTreasure);
app.get("/api/treasure/user", auth.usersOnly, treasureCTRL.getUserTreasure);
app.post("/api/treasure/user", auth.usersOnly, treasureCTRL.addUserTreasure);
app.get(
  "/api/treasure/all",
  auth.usersOnly,
  auth.adminsOnly,
  treasureCTRL.getAllTreasure
);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
