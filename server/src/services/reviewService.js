import { Service, Container } from "typedi";
import sunhanService from "./sunhanService";
import Review from "../models/reviews";
import User from "../models/users";
import Sunhan from "../models/sunhanShop";
import Post from "../models/posts";
import throwError from "../utils/throwError";
import serviceError from "../utils/serviceError";
import { isValidObjectId } from "mongoose";
import seoulDate from "../utils/seoulDate";
import logger from "../config/logger";

const sunhanServiceInstance = Container.get(sunhanService);
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

  async deleteReview(userId, reviewId) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      if (!isValidObjectId(reviewId)) {
        throw throwError(400, "reviewId가 유효하지 않습니다.");
      }

      const review = await this.review.findById(reviewId);

      const sunhan = await sunhanServiceInstance.getSunhan(review.sunhanId);

      // sunhan reviews fields의 삭제하려는 리뷰가 있다면
      if (sunhan.reviews.find((review) => review.id === reviewId)) {
        // sunhan reviews fields를 filter를 이용해 삭제하려는 리뷰를 제거한 새로운 배열을 만든다
        sunhan.reviews = sunhan.reviews.filter(
          (review) => review.id !== reviewId
        );

        // 새로운 reviews 배열이 0보다 크다면
        if (sunhan.reviews.length > 0) {
          const newReview = await this.review
            .findOne({
              _id: { $lt: sunhan.reviews[0].id },
            })
            .sort({ _id: -1 });

          if (newReview && newReview.id !== reviewId) {
            sunhan.reviews.unshift(newReview);
          }
        }
      }

      await Promise.all([
        sunhan.save(),
        this.user.findByIdAndUpdate(userId, {
          $pull: { writeReviews: reviewId },
        }),
        this.review.findByIdAndDelete(reviewId),
      ]);
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }
}
