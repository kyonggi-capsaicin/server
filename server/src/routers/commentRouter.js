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
  deleteReviewComment,
  deletePostComment
} from "../controllers/commentController";

const commentRouter = express.Router();

commentRouter.get("/:id/review", getAllReviewComments);

commentRouter.get("/:id/post", getAllPostComments);

commentRouter.get("/:id", getComment);

commentRouter.post("/review", authJWT, createReviewComment);

commentRouter.post("/post", authJWT, createPostComment);

commentRouter.patch("/:id", authJWT, updateComment);

commentRouter.patch("/:id/block", authJWT, blockComment);

commentRouter.put("/:id/parent", authJWT, deleteParentComment);

commentRouter.delete("/:id/review", authJWT, deleteReviewComment);

commentRouter.delete("/:id/post", authJWT, deletePostComment);

export default commentRouter;
