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
        avatarUrl: 1,
      });

      return user;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async getBlockUserList(userId) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      const user = await this.user
        .findById(userId, {
          blockUsers: 1,
        })
        .populate("blockUsers");

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

      const posts = await this.user
        .findById(userId, {
          address: 0,
          nickname: 0,
          avatarUrl: 0,
          email: 0,
          scrapSunhan: 0,
          scrapChild: 0,
          blockPosts: 0,
          blockReviews: 0,
          blockComments: 0,
          naverId: 0,
          blockUsers: 0,
          childCard: 0,
          __v: 0,
          writeReviews: 0,
          writeComments: 0,
          writePosts: { $slice: [page * 10, page * 10 + 10] },
        })
        .populate("writePosts");

      return posts;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async getUserWriteComments(userId, page) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      const comments = await this.user
        .findById(userId, { writeComments: 1 })
        .populate("writeComments");

      // ObjectId to String
      let ids = comments.writeComments.map((comment) => {
        return Types.ObjectId(comment.postId).toString();
      });

      // 중복제거
      ids = Array.from(new Set(ids));
      // String to ObjectId
      ids = ids.map((id) => new Types.ObjectId(id));

      // $in 순서 보장하지 않으므로 aggregate를 통해 순서보장
      const posts = await this.post.aggregate([
        { $match: { _id: { $in: ids } } },
        { $addFields: { __order: { $indexOfArray: [ids, "$_id"] } } },
        { $sort: { __order: 1 } },
        { $skip: page * 10 },
        { $limit: 10 },
        { $project: { __v: 0, __order: 0, blockNumber: 0 } },
      ]);

      return posts;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async getUserWriteReviews(userId, page) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      // const reviews = await this.user
      //   .findById(userId, {
      //     writeReviews: 1,
      //   })
      //   .populate(
      //     "writeReviews",
      //     "writer _id sunhanId content imageUrl createAt"
      //   )
      //   .skip(page * 10)
      //   .limit(10);

      const reviews = await this.user
        .findById(userId, {
          address: 0,
          nickname: 0,
          avatarUrl: 0,
          email: 0,
          scrapSunhan: 0,
          scrapChild: 0,
          blockPosts: 0,
          blockReviews: 0,
          blockComments: 0,
          naverId: 0,
          blockUsers: 0,
          childCard: 0,
          __v: 0,
          writePosts: 0,
          writeComments: 0,
          writeReviews: { $slice: [page * 10, page * 10 + 10] },
        })
        .populate("writeReviews");

      return reviews;
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
