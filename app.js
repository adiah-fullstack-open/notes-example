const cors = require("cors");
const express = require("express");
require("express-async-errors");
const mongoose = require("mongoose");

const loginRouter = require("./controllers/login");
const notesRouter = require("./controllers/notes");
const usersRouter = require("./controllers/users");

const config = require("./utils/config");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

const app = express();

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDb");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDb:", error.message);
  });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/login", loginRouter);
app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
