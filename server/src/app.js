import express from "express";
import dotenv from "dotenv";
import "./db";

const startServer = async () => {
  const PORT = process.env.PORT || 4000;

  dotenv.config();
  const app = express();

  await require("./loaders/express").default(app);

  app.listen(process.env.PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });

  process.on("uncaughtException", function (err) {
    console.error("uncaughtException (Node is alive)", err);
  });
};

startServer();
