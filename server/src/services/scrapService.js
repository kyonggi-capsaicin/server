import { Service } from "typedi";
import User from "../models/users";
import throwError from "../utils/throwError";
import serviceError from "../utils/serviceError";
import { isValidObjectId } from "mongoose";
import logger from "../config/logger";

@Service()
export default class scrapService {
  constructor() {
    this.user = User;
  }

  async getScraps(userId, type) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      let scraps;
      if (type === "sunhan") {
        scraps = await this.user
          .findById(userId, { scrapSunhan: 1, _id: 0 })
          .populate("scrapSunhan");
      } else if (type === "children") {
        scraps = await this.user
          .findById(userId, { scrapChild: 1, _id: 0 })
          .populate("scrapChild");
      }

      return scraps;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async createScrap(userId, shopId, type) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      if (!isValidObjectId(shopId)) {
        throw throwError(400, "shopId가 유효하지 않습니다.");
      }

      if (type === "sunhan") {
        await this.user.findByIdAndUpdate(userId, {
          $addToSet: { scrapSunhan: shopId },
        });
      } else if (type === "children") {
        await this.user.findByIdAndUpdate(userId, {
          $addToSet: { scrapChild: shopId },
        });
      }
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async deleteScrap(userId, shopId, type) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      if (!isValidObjectId(shopId)) {
        throw throwError(400, "shopId가 유효하지 않습니다.");
      }

      if (type === "sunhan") {
        await this.user.findByIdAndUpdate(userId, {
          $pull: { scrapSunhan: shopId },
        });
      } else if (type === "children") {
        await this.user.findByIdAndUpdate(userId, {
          $pull: { scrapChild: shopId },
        });
      }
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }
}