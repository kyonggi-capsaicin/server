import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DB_HOST_TEST) console.error("DB_HOST is required!!!");

if (process.env.NODE_ENV === "dev") {
  mongoose
    .connect(process.env.DB_HOST_TEST, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => console.log("MongoDB Connected!"))
    .catch((err) => console.log(err.message));
} else {
  mongoose
    .connect(process.env.DB_HOST, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => console.log("MongoDB Connected!"))
    .catch((err) => console.log(err.message));
}
