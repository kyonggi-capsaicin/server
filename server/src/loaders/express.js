import "reflect-metadata";
import express from "express";
import morgan from "morgan";

import dataRouter from "../routers/dataRouter";
import postRouter from "../routers/postRouter";
import authRouter from "../routers/authRouter";
import scrapRouter from "../routers/scrapRouter";
import commentRouter from "../routers/commentRouter";
import reviewRouter from "../routers/reviewRouter";
import sunhanRouter from "../routers/sunhanRouter";
import userRouter from "../routers/userRouter";
import childrenRouter from "../routers/childrenRouter";

export default (app) => {
  app.use(express.json());
  app.use(morgan("dev"));

  app.use("/img", express.static("uploads"));

  app.use("/api/data", dataRouter);
  app.use("/api/posts", postRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/scraps", scrapRouter);
  app.use("/api/comments", commentRouter);
  app.use("/api/reviews", reviewRouter);
  app.use("/api/sunhans", sunhanRouter);
  app.use("/api/users", userRouter);
  app.use("/api/children", childrenRouter);

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error("Not Found");
    err["status"] = 404;
    next(err);
  });

  /// error handlers
  app.use((err, req, res, next) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === "UnauthorizedError") {
      return res.status(err.status).send({ message: err.message }).end();
    }
    return next(err);
  });

  app.use((err, req, res, next) => {
    console.log(err.status);
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
