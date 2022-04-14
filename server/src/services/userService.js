import { Service } from "typedi";
import User from "../models/users";
import throwError from "../utils/throwError";
import serviceError from "../utils/serviceError";
import { isValidObjectId } from "mongoose";

@Service()
export default class userService {
  constructor() {
    this.user = User;
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
      }

      await this.user.findByIdAndUpdate(userId, updateUserDTO);
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

      // todo
      // 1. 유저 삭제
      // 2. 유저가 작성한 리뷰 삭제
      // 3. 유저가 작성한 게시글 삭제
      // 4. 게시글이 있다면 해당 게시글의 댓글 삭제
      // 5. 유저가 작성한 댓글 삭제 (부모 댓글, 자식 댓글 구분 필요)

      await this.user.findById(sunhanId, { __v: 0 });
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }
}
