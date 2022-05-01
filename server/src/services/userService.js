import { Service } from "typedi";
import User from "../models/users";
import Review from "../models/reviews";
import Post from "../models/posts";
import Sunhan from "../models/sunhanShop";
import Comment from "../models/comments";
import throwError from "../utils/throwError";
import serviceError from "../utils/serviceError";
import { isValidObjectId, Types } from "mongoose";

@Service()
export default class userService {
  constructor() {
    this.user = User;
    this.review = Review;
    this.post = Post;
    this.comment = Comment;
    this.sunhan = Sunhan;
  }

  async getUser(userId) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      const user = await this.user.findById(userId, {
        email: 1,
        nickname: 1,
      });

      return user;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async getUserWritePosts(userId, page) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      page = page ? page : 0;

      const posts = await this.user
        .findById(userId, { writePosts: 1 })
        .populate("writePosts", "writer content _id createAt commentCount")
        .skip(page * 10)
        .limit(10);

      return posts;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async getUserWriteComments(userId) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      const comments = await this.user.aggregate([
        { $match: { _id: Types.ObjectId(userId) } },
        {
          $unwind: "$writeComments",
        },

        {
          $lookup: {
            from: "comments",
            localField: "writeComments",
            foreignField: "_id",
            as: "writeComments",
          },
        },

        {
          $group: {
            _id: "$_id",
            postId: { $addToSet: "$writeComments.postId" },
          },
        },
      ]);

      const posts = await this.post.find(
        { _id: { $in: comments[0].postId } },
        { __v: 0, updateAt: 0, blockNumber: 0 }
      );

      return posts;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async getUserWriteReviews(userId) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      const user = await this.user.findById(userId, {
        email: 1,
        nickname: 1,
      });

      return user;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async setAddressInfo(userId, addressDTO) {
    try {
      await this.user.findByIdAndUpdate(userId, { address: addressDTO });
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async updateUser(userId, updateUserDTO, avatarUrl) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      if (avatarUrl) {
        updateUserDTO.avatarUrl = avatarUrl;

        // avatarUrl, nickname 모두 변경하는 경우
        if (updateUserDTO.nickname) {
          await Promise.all([
            this.user.findByIdAndUpdate(userId, updateUserDTO),
            this.sunhan.updateMany(
              {},
              {
                $set: {
                  "reviews.$[element].writer.avatarUrl": avatarUrl,
                  "reviews.$[element].writer.nickname": updateUserDTO.nickname,
                },
              },
              { arrayFilters: [{ "element.writer._id": userId }] }
            ),
            this.comment.updateMany(
              { "writer._id": userId },
              {
                $set: {
                  "writer.avatarUrl": avatarUrl,
                  "writer.nickname": updateUserDTO.nickname,
                },
              }
            ),
            this.post.updateMany(
              { "writer._id": userId },
              {
                $set: {
                  "writer.avatarUrl": avatarUrl,
                  "writer.nickname": updateUserDTO.nickname,
                },
              }
            ),
            this.review.updateMany(
              { "writer._id": userId },
              {
                $set: {
                  "writer.avatarUrl": avatarUrl,
                  "writer.nickname": updateUserDTO.nickname,
                },
              }
            ),
          ]);
          return;
        }

        // avatarUrl 변경하는 경우
        await Promise.all([
          this.user.findByIdAndUpdate(userId, updateUserDTO),
          this.sunhan.updateMany(
            {},
            {
              $set: {
                "reviews.$[element].writer.avatarUrl": avatarUrl,
              },
            },
            { arrayFilters: [{ "element.writer._id": userId }] }
          ),
          this.comment.updateMany(
            { "writer._id": userId },
            {
              $set: {
                "writer.avatarUrl": avatarUrl,
              },
            }
          ),
          this.post.updateMany(
            { "writer._id": userId },
            {
              $set: {
                "writer.avatarUrl": avatarUrl,
              },
            }
          ),
          this.review.updateMany(
            { "writer._id": userId },
            {
              $set: {
                "writer.avatarUrl": avatarUrl,
              },
            }
          ),
        ]);
        return;
      }
      // nickname만 변경하는 경우
      else {
        await Promise.all([
          this.user.findByIdAndUpdate(userId, updateUserDTO),
          this.sunhan.updateMany(
            {},
            {
              $set: {
                "reviews.$[element].writer.nickname": updateUserDTO.nickname,
              },
            },
            { arrayFilters: [{ "element.writer._id": userId }] }
          ),
          this.comment.updateMany(
            { "writer._id": userId },
            {
              $set: {
                "writer.nickname": updateUserDTO.nickname,
              },
            }
          ),
          this.post.updateMany(
            { "writer._id": userId },
            {
              $set: {
                "writer.nickname": updateUserDTO.nickname,
              },
            }
          ),
          this.review.updateMany(
            { "writer._id": userId },
            {
              $set: {
                "writer.nickname": updateUserDTO.nickname,
              },
            }
          ),
        ]);
      }
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async blockUser(userId, blockUserId) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      if (!isValidObjectId(blockUserId)) {
        throw throwError(400, "blockUserId가 유효하지 않습니다.");
      }

      const blockUser = await this.user.findById(blockUserId);

      await this.user.findByIdAndUpdate(userId, {
        $addToSet: { blockUsers: blockUser },
      });
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async unblockUser(userId, blockUserId) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      if (!isValidObjectId(blockUserId)) {
        throw throwError(400, "blockUserId가 유효하지 않습니다.");
      }

      await this.user.findByIdAndUpdate(userId, {
        $pull: { blockUsers: { _id: blockUserId } },
      });
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async deleteUser(userId) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      await Promise.all([
        this.user.findByIdAndDelete(userId),
        this.review.updateMany(
          { "writer._id": userId },
          {
            $set: {
              "writer.nickname": "탈퇴 회원",
              "writer.avatarUrl": "902e5693-e0bb-4097-8ab5-b81a71003fe4.jpg",
            },
          }
        ),
        this.post.updateMany(
          { "writer._id": userId },
          {
            $set: {
              "writer.nickname": "탈퇴 회원",
              "writer.avatarUrl": "902e5693-e0bb-4097-8ab5-b81a71003fe4.jpg",
            },
          }
        ),
        this.comment.updateMany(
          { "writer._id": userId },
          {
            $set: {
              "writer.nickname": "탈퇴 회원",
              "writer.avatarUrl": "902e5693-e0bb-4097-8ab5-b81a71003fe4.jpg",
            },
          }
        ),
      ]);
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }
}
