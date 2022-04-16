import reviewService from "../services/reviewService";
import { Container } from "typedi";
import logger from "../config/logger";
import throwError from "../utils/throwError";

const reviewServiceInstance = Container.get(reviewService);

export const getAllReviews = async (req, res, next) => {
  try {
    const { id: sunhanId } = req.params;
    let { page } = req.query;
    page = page ? page : 0;

    const posts = await reviewServiceInstance.getAllReviews(sunhanId, page);
    return res.status(200).json({ message: "success", data: posts });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    let filename = null;
    if (req.file) {
      filename = req.file.filename;
    }

    const review = await reviewServiceInstance.createReview(
      req.id,
      req.body,
      filename
    );

    return res.status(200).json({ message: "success", data: review });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    let filename = null;
    if (req.file) {
      filename = req.file.filename;
    }

    const { id: reviewId } = req.params;

    const post = await reviewServiceInstance.updateReview(
      reviewId,
      req.body,
      filename
    );

    return res.status(200).json({ message: "success", data: post });
  } catch (error) {
    next(error);
  }
};

export const blockReview = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    await postServiceInstance.blockPost(req.id, postId);

    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id: reviewId } = req.params;

    await reviewServiceInstance.deleteReview(req.id, reviewId);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};
