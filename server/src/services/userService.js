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

  async blockUser(sunhanId) {
    try {
      if (!isValidObjectId(sunhanId)) {
        throw throwError(400, "sunhanId가 유효하지 않습니다.");
      }

      const sunhan = await this.sunhan.findById(sunhanId, { __v: 0 });

      return sunhan;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async unblockUser(sunhanId) {
    try {
      if (!isValidObjectId(sunhanId)) {
        throw throwError(400, "sunhanId가 유효하지 않습니다.");
      }

      const sunhan = await this.sunhan.findById(sunhanId, { __v: 0 });

      return sunhan;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async deleteUser(sunhanId) {
    try {
      if (!isValidObjectId(sunhanId)) {
        throw throwError(400, "sunhanId가 유효하지 않습니다.");
      }

      const sunhan = await this.sunhan.findById(sunhanId, { __v: 0 });

      return sunhan;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }
}
