import { Service } from "typedi";
import Post from "../models/posts";
import User from "../models/users";
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
  }

  async getAllPosts() {
    try {
      const posts = await this.post.find({});
      return posts;
    } catch (error) {
      console.error(error.message);
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
      postDTO.createAt = seoulDate;
      postDTO.updateAt = seoulDate;

      const newPost = new this.post(postDTO);
      user.writePosts = newPost.id;

      const [post] = await Promise.all([newPost.save(), user.save()]);

      return post;
    } catch (error) {
      console.error(error.message);
      throw serviceError(error);
    }
  }
}
