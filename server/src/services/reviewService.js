import { Service } from "typedi";
import Review from "../models/reviews";
import User from "../models/users";
import Sunhan from "../models/sunhanShop";
import Post from "../models/posts";
import throwError from "../utils/throwError";
import serviceError from "../utils/serviceError";
import { isValidObjectId } from "mongoose";
import seoulDate from "../utils/seoulDate";
import logger from "../config/logger";

@Service()
export default class reviewService {
  constructor() {
    this.review = Review;
    this.user = User;
    this.sunhan = Sunhan;
    this.post = Post;
  }

  async getAllReviews(sunhanId, page) {
    try {
      if (!isValidObjectId(sunhanId)) {
        throw throwError(400, "sunhanId가 유효하지 않습니다.");
      }

      const reviews = await this.review
        .find({ sunhanId }, { __v: 0 })
        .sort({ _id: -1 })
        .skip(page * 10)
        .limit(10);

      return reviews;
    } catch (error) {
      console.error(error.message);
      throw serviceError(error);
    }
  }

  async getPost(postId) {
    try {
      if (!isValidObjectId(postId)) {
        throw throwError(400, "postId가 유효하지 않습니다.");
      }

      const post = await this.post.findById(postId, { __v: 0 });
      return post;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async createReview(userId, reviewDTO, imageUrl) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      const user = await this.user.findById(userId);

      if (imageUrl) {
        reviewDTO.imageUrl = imageUrl;
      }

      reviewDTO.writer = user;
      reviewDTO.createAt = seoulDate();
      reviewDTO.updateAt = seoulDate();

      const newReview = new this.review(reviewDTO);

      const [review] = await Promise.all([
        newReview.save(),
        this.user.findByIdAndUpdate(userId, {
          $push: { writeReviews: { $each: [newReview.id], $position: 0 } },
        }),
        this.sunhan.findByIdAndUpdate(reviewDTO.sunhanId, {
          $push: { reviews: { $each: [newReview], $slice: -10 } },
        }),
      ]);

      return review;
    } catch (error) {
      console.error(error.message);
      throw serviceError(error);
    }
  }

  async updateReview(reviewId, updateDTO, imageUrl) {
    try {
      if (!isValidObjectId(reviewId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      if (!imageUrl) {
        const review = await this.review.findById(reviewId);
        updateDTO.imageUrl = review.imageUrl;
      } else {
        updateDTO.imageUrl = imageUrl;
      }

      updateDTO.updateAt = seoulDate();

      const [updatedReview] = await Promise.all([
        this.review.findByIdAndUpdate(reviewId, updateDTO, {
          new: true,
          projection: { __v: 0 },
        }),
        this.sunhan.updateMany(
          {},
          {
            $set: {
              "reviews.$[element].imageUrl": updateDTO.imageUrl,
              "reviews.$[element].content": updateDTO.content,
              "reviews.$[element].updateAt": updateDTO.updateAt,
            },
          },
          { arrayFilters: [{ "element._id": reviewId }] }
        ),
      ]);

      return updatedReview;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async blockPost(userId, postId) {
    try {
      if (!isValidObjectId(postId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      await Promise.all([
        this.post.findByIdAndUpdate(postId, { $inc: { blockNumber: 1 } }),
        this.user.findByIdAndUpdate(userId, {
          $addToSet: { blockPosts: postId },
        }),
      ]);
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async deletePost(userId, postId) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      if (!isValidObjectId(postId)) {
        throw throwError(400, "postId가 유효하지 않습니다.");
      }

      const [comments] = await Promise.all([this.comment.find({ postId })]);

      const commentIdArr = comments.map((comment) => comment._id);

      await Promise.all([
        this.user.findByIdAndUpdate(userId, {
          $pull: { writePosts: postId, writeComments: { $in: commentIdArr } },
        }),
        this.post.findByIdAndDelete(postId),
        this.this.comment.deleteMany({ postId }),
      ]);
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }
}
