import { Service } from "typedi";
import { isValidObjectId } from "mongoose";
import User from "../models/users";
import Comment from "../models/comments";
import Review from "../models/reviews";
import Post from "../models/posts";
import serviceError from "../utils/serviceError";
import throwError from "../utils/throwError";
import seoulDate from "../utils/seoulDate";
import logger from "../config/logger";

@Service()
export default class commentService {
  constructor() {
    this.user = User;
    this.coment = Comment;
    this.post = Post;
    this.review = Review;
  }

  async createReviewComment(userId, reviewId, commentDTO) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      if (!isValidObjectId(reviewId)) {
        throw throwError(400, "reviewId가 유효하지 않습니다.");
      }

      commentDTO.createAt = seoulDate;
      commentDTO.updateAt = seoulDate;
      commentDTO.reviewId = reviewId;

      const comment = new this.coment(commentDTO);

      const [newComment] = await Promise.all([
        comment.save(),
        this.user.findByIdAndUpdate(userId, {
          $push: { writeComments: comment.id },
        }),
        this.review.findByIdAndUpdate(reviewId, { $inc: { commentCount: 1 } }),
      ]);

      return newComment;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async createPostComment(userId, postId, commentDTO) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      if (!isValidObjectId(postId)) {
        throw throwError(400, "postId가 유효하지 않습니다.");
      }

      const user = await this.user.findById(userId);

      commentDTO.createAt = seoulDate;
      commentDTO.updateAt = seoulDate;
      commentDTO.postId = postId;
      commentDTO.writer = user;

      const comment = new this.coment(commentDTO);

      const [newComment] = await Promise.all([
        comment.save(),
        this.user.findByIdAndUpdate(userId, {
          $push: { writeComments: { $each: [comment.id], $position: 0 } },
        }),
        this.post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } }),
      ]);

      return newComment;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async getAllPostComments(postId, page) {
    try {
      if (!isValidObjectId(postId)) {
        throw throwError(400, "postId가 유효하지 않습니다.");
      }

      const comments = await this.coment
        .find({ postId }, { __v: 0 })
        .sort({ _id: -1 })
        .skip(page * 10)
        .limit(10);

      return comments;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async getComment(commentId) {
    try {
      if (!isValidObjectId(commentId)) {
        throw throwError(400, "commentId가 유효하지 않습니다.");
      }

      const comment = await this.coment.findById(commentId, { __v: 0 });
      return comment;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async updateComment(commentId, updateCommentDTO) {
    try {
      if (!isValidObjectId(commentId)) {
        throw throwError(400, "commentId가 유효하지 않습니다.");
      }

      updateCommentDTO.updateAt = seoulDate;

      const updatedComment = await this.coment.findByIdAndUpdate(
        commentId,
        updateCommentDTO,
        { new: true, projection: { __v: 0 } }
      );
      return updatedComment;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async deletePostComment(userId, commentId, postId) {
    try {
      if (!isValidObjectId(commentId)) {
        throw throwError(400, "commentId가 유효하지 않습니다.");
      }

      if (!isValidObjectId(postId)) {
        throw throwError(400, "postId가 유효하지 않습니다.");
      }

      await Promise.all([
        this.user.findByIdAndUpdate(userId, {
          $pull: { writeComments: commentId },
        }),
        this.coment.findByIdAndDelete(commentId),
        this.post.findByIdAndUpdate(postId, { $inc: { commentCount: -1 } }),
      ]);
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async blockComment(userId, commentId) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      if (!isValidObjectId(commentId)) {
        throw throwError(400, "commentId가 유효하지 않습니다.");
      }

      await Promise.all([
        this.user.findByIdAndUpdate(userId, {
          $addToSet: { blockComments: commentId },
        }),
        this.coment.findByIdAndUpdate(commentId, { $inc: { blockNumber: 1 } }),
      ]);
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }
}
