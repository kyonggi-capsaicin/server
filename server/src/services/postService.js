import { Service } from "typedi";
import Post from "../models/posts";
import logger from "../../config/logger";

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
}
