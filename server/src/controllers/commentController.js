import { Container } from "typedi";
import commentService from "../services/commentService";

const commentServiceInstance = Container.get(commentService);

export const getAllReviewComments = async (req, res, next) => {
  try {
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllPostComments = async (req, res, next) => {
  try {
    let { page } = req.query;
    const { id: postId } = req.params;

    page = page ? page : 0;
    const comments = await commentServiceInstance.getAllPostComments(
      postId,
      page
    );

    return res.status(200).json({ message: "success", data: comments });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getComment = async (req, res, next) => {
  try {
    const { id: commentId } = req.params;

    const comment = await commentServiceInstance.getComment(commentId);
    return res.status(200).json({ message: "success", data: comment });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createReviewParentComment = async (req, res, next) => {
  try {
    const { postId } = req.body;

    const comment = await commentServiceInstance.createPostComment(
      req.id,
      postId,
      req.body
    );

    return res.status(200).json({ message: "success", data: comment });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createPostParentComment = async (req, res, next) => {
  try {
    const { postId } = req.body;

    const comment = await commentServiceInstance.createPostParentComment(
      req.id,
      postId,
      req.body
    );

    return res.status(200).json({ message: "success", data: comment });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createReviewComment = async (req, res, next) => {
  try {
    const { reviewId, parentId } = req.body;

    const comment = await commentServiceInstance.createReviewComment(
      req.id,
      reviewId,
      req.body
    );

    return res.status(200).json({ message: "success", data: comment });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createPostComment = async (req, res, next) => {
  try {
    const { postId, parentId } = req.body;

    const comment = await commentServiceInstance.createPostComment(
      req.id,
      postId,
      parentId,
      req.body
    );

    return res.status(200).json({ message: "success", data: comment });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const { id: commentId } = req.params;

    const comment = await commentServiceInstance.updateComment(
      commentId,
      req.body
    );

    return res.status(200).json({ message: "success", data: comment });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const blockComment = async (req, res, next) => {
  try {
    const { id: commentId } = req.params;

    await commentServiceInstance.blockComment(req.id, commentId);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteParentComment = async (req, res, next) => {
  try {
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteReviewComment = async (req, res, next) => {
  try {
    const { id: commentId } = req.params;
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deletePostComment = async (req, res, next) => {
  try {
    const { id: commentId } = req.params;

    await commentServiceInstance.deletePostComment(req.id, commentId);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
