import { Service } from "typedi";
import Post from "../models/posts";
import logger from "../config/logger";

@Service()
export default class postService {
  constructor() {
    this.post = Post;
  }

  async getAllPosts() {
    try {
      const posts = await this.post.find({});
      return posts;
    } catch (error) {
      logger.error(error.message);
    }
  }

  async createPost(postDTO) {
    try {
      // todo
      // 1. 유저 찾고 post의 writer 필드에 넣기

      const posts = await this.post.create(postDTO);
      return posts;
    } catch (error) {
      logger.error(error.message);
      throw Error(error.message);
    }
  }
}
