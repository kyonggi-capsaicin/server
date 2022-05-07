import express from "express";
import authJWT from "../middlewares/authJWT";

import {
  getAllPostComments,
  getComment,
  createPostComment,
  createPostParentComment,
  updateComment,
  blockComment,
  deleteParentPostComment,
  deletePostComment,
} from "../controllers/commentController";

const commentRouter = express.Router();

commentRouter.get("/:id/post", getAllPostComments);

commentRouter.get("/:id", getComment);

commentRouter.post("/post", authJWT, createPostComment);

commentRouter.post("/post/parent", authJWT, createPostParentComment);

commentRouter.patch("/:id", authJWT, updateComment);

commentRouter.patch("/:id/block", authJWT, blockComment);

commentRouter.put("/:id/post/parent", authJWT, deleteParentPostComment);

commentRouter.delete("/:id/post", authJWT, deletePostComment);

export default commentRouter;
