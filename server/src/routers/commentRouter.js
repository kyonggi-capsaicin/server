import express from "express";
import authJWT from "../middlewares/authJWT";

import {
  getAllReviewComments,
  getAllPostComments,
  getComment,
  createReviewComment,
  createPostComment,
  updateComment,
  blockComment,
  deleteParentComment,
  deleteComment,
} from "../controllers/commentController";

const commentRouter = express.Router();

commentRouter.get("/review/:id", getAllReviewComments);

commentRouter.get("/post/:id", getAllPostComments);

commentRouter.get("/:id", getComment);

commentRouter.post("/review", authJWT, createReviewComment);

commentRouter.post("/post", authJWT, createPostComment);

commentRouter.patch("/:id", authJWT, updateComment);

commentRouter.patch("/:id/block", authJWT, blockComment);

commentRouter.put("/:id/parent", authJWT, deleteParentComment);

commentRouter.delete("/:id", authJWT, deleteComment);

export default commentRouter;
