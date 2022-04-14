import { Service } from "typedi";
import { Types } from "mongoose";
import Post from "../models/posts";
import User from "../models/users";
import Comment from "../models/comments";
import throwError from "../utils/throwError";
import serviceError from "../utils/serviceError";
import { isValidObjectId } from "mongoose";
import seoulDate from "../utils/seoulDate";
import logger from "../config/logger";

@Service()
export default class postService {
  constructor() {
    this.post = Post;
    this.user = User;
    this.comment = Comment;
  }

  async getAllPosts(page) {
    try {
      const posts = await this.post
        .find({}, { __v: 0 })
        .sort({ _id: -1 })
        .skip(page * 10)
        .limit(10);

      return posts;
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

  async createPost(userId, postDTO) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      const user = await this.user.findById(userId);

      postDTO.writer = user;
      postDTO.createAt = seoulDate();
      postDTO.updateAt = seoulDate();

      const newPost = new this.post(postDTO);

      const [post] = await Promise.all([
        newPost.save(),
        this.user.findByIdAndUpdate(userId, {
          $push: { writePosts: { $each: [newPost.id], $position: 0 } },
        }),
      ]);

      const postWithoutVersion = await this.post.findById(post.id, { __v: 0 });

      return postWithoutVersion;
    } catch (error) {
      console.error(error.message);
      throw serviceError(error);
    }
  }

  async updatePost(postId, updateDTO) {
    try {
      if (!isValidObjectId(postId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      updateDTO.updateAt = seoulDate();

      const updatedPost = await this.post.findByIdAndUpdate(postId, updateDTO, {
        new: true,
        projection: { __v: 0 },
      });

      return updatedPost;
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
        // 게시글 삭제
        this.post.findByIdAndDelete(postId),
        // 게시글 작성자의 writePosts 삭제
        this.user.findByIdAndUpdate(userId, {
          $pull: { writePosts: postId },
        }),
        // 모든 유저를 대상으로 writeComments 삭제
        this.user.updateMany(
          {},
          { $pull: { writeComments: { $in: commentIdArr } } }
        ),
        // 모든 댓글 삭제
        this.comment.deleteMany({ postId }),
      ]);
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }
}
