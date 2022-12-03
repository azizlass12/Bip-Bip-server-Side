const bodyParser = require("body-parser");
const cors = require("cors");

const express = require("express");

const userRouter = require("./routes/userRoutes");
const commandeRouter = require("./routes/commandeRoutes");
const messageRouter = require("./routes/messageRoutes");
const offreRouter = require("./routes/offreRoutes");

app = express();
app.use(cors({ origine: "*" }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use("/v2/commandes", commandeRouter);
app.use("/v2/users", userRouter);
app.use("/v2/messages", messageRouter);
app.use("/v2/offres", offreRouter);

module.exports = app;
