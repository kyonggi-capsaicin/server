import { Service } from "typedi";
import Review from "../models/reviews";
import User from "../models/users";
import Sunhan from "../models/sunhanShop";
import Post from "../models/posts";
import Child from "../models/childCardShop";
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
    this.child = Child;
  }

  async getAllReviews(id, query) {
    try {
      if (!isValidObjectId(id)) {
        throw throwError(400, "가맹점 id가 유효하지 않습니다.");
      }

      let { page, type } = query;
      page = page ? page : 0;

      let reviews;
      if (type === "sunhan") {
        reviews = await this.review
          .find({ sunhanId: id }, { __v: 0 })
          .sort({ _id: -1 })
          .skip(page * 10)
          .limit(10);
      } else if (type === "children") {
        reviews = await this.review
          .find({ childrenId: id }, { __v: 0 })
          .sort({ _id: -1 })
          .skip(page * 10)
          .limit(10);
      }

      return reviews;
    } catch (error) {
      console.error(error.message);
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
      let review;

      if (reviewDTO.sunhanId) {
        [review] = await Promise.all([
          newReview.save(),
          this.user.findByIdAndUpdate(userId, {
            $push: { writeReviews: { $each: [newReview.id], $position: 0 } },
          }),
          this.sunhan.findByIdAndUpdate(reviewDTO.sunhanId, {
            $push: { reviews: { $each: [newReview], $slice: -10 } },
          }),
        ]);
      } else if (reviewDTO.childrenId) {
        [review] = await Promise.all([
          newReview.save(),
          this.user.findByIdAndUpdate(userId, {
            $push: { writeReviews: { $each: [newReview.id], $position: 0 } },
          }),
          this.child.findByIdAndUpdate(reviewDTO.childrenId, {
            $push: { reviews: { $each: [newReview], $slice: -10 } },
          }),
        ]);
      }

      return review;
    } catch (error) {
      console.error(error.message);
      throw serviceError(error);
    }
  }

  async updateReview(reviewId, updateDTO, imageUrl) {
    try {
      if (!isValidObjectId(reviewId)) {
        throw throwError(400, "reviewId가 유효하지 않습니다.");
      }

      const review = await this.review.findById(reviewId);
      if (!imageUrl) {
        updateDTO.imageUrl = review.imageUrl;
      } else {
        updateDTO.imageUrl = imageUrl;
      }

      updateDTO.updateAt = seoulDate();

      let updatedReview;
      if (updateDTO.type === "sunhan") {
        [updatedReview] = await Promise.all([
          this.review.findByIdAndUpdate(reviewId, updateDTO, {
            new: true,
            projection: { __v: 0 },
          }),
          this.sunhan.updateMany(
            { _id: review.sunhanId },
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
      } else if (updateDTO.type === "children") {
        [updatedReview] = await Promise.all([
          this.review.findByIdAndUpdate(reviewId, updateDTO, {
            new: true,
            projection: { __v: 0 },
          }),
          this.child.updateMany(
            { _id: review.childrenId },
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
      }

      return updatedReview;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async blockReview(userId, reviewId) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      if (!isValidObjectId(reviewId)) {
        throw throwError(400, "reviewId가 유효하지 않습니다.");
      }

      await Promise.all([
        this.review.findByIdAndUpdate(reviewId, { $inc: { blockNumber: 1 } }),
        this.user.findByIdAndUpdate(userId, {
          $addToSet: { blockReviews: reviewId },
        }),
      ]);
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async deleteReview(userId, reviewId, type) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      if (!isValidObjectId(reviewId)) {
        throw throwError(400, "reviewId가 유효하지 않습니다.");
      }

      const review = await this.review.findById(reviewId);

      if (type === "sunhan") {
        const sunhan = await this.sunhan.findById(review.sunhanId);

        // sunhan reviews fields의 삭제하려는 리뷰가 있다면
        if (sunhan.reviews.find((review) => review.id === reviewId)) {
          // sunhan reviews fields를 filter를 이용해 삭제하려는 리뷰를 제거한 새로운 배열을 만든다
          console.log(reviewId, "reviewId");
          sunhan.reviews = sunhan.reviews.filter(
            (review) => review.id !== reviewId
          );

          console.log("first", sunhan.reviews);
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

          console.log("second", sunhan.reviews);
        }

        await Promise.all([
          sunhan.save(),
          this.user.findByIdAndUpdate(userId, {
            $pull: { writeReviews: reviewId },
          }),
          this.review.findByIdAndDelete(reviewId),
        ]);
      } else if (type === "children") {
        const childrenShop = await this.child.findById(review.childrenId);

        // sunhan reviews fields의 삭제하려는 리뷰가 있다면
        if (childrenShop.reviews.find((review) => review.id === reviewId)) {
          // sunhan reviews fields를 filter를 이용해 삭제하려는 리뷰를 제거한 새로운 배열을 만든다
          childrenShop.reviews = childrenShop.reviews.filter(
            (review) => review.id !== reviewId
          );

          // 새로운 reviews 배열이 0보다 크다면
          if (childrenShop.reviews.length > 0) {
            const newReview = await this.review
              .findOne({
                _id: { $lt: childrenShop.reviews[0].id },
              })
              .sort({ _id: -1 });

            if (newReview && newReview.id !== reviewId) {
              childrenShop.reviews.unshift(newReview);
            }
          }
        }

        await Promise.all([
          childrenShop.save(),
          this.user.findByIdAndUpdate(userId, {
            $pull: { writeReviews: reviewId },
          }),
          this.review.findByIdAndDelete(reviewId),
        ]);
      }
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }
}
