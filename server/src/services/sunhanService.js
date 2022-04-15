import { Service } from "typedi";
import Sunhan from "../models/sunhanShop";
import User from "../models/users";
import throwError from "../utils/throwError";
import serviceError from "../utils/serviceError";
import { isValidObjectId } from "mongoose";
import logger from "../config/logger";

@Service()
export default class sunhanService {
  constructor() {
    this.sunhan = Sunhan;
    this.user = User;
  }

  async getAllSunhan(userId, query) {
    try {
      // todo
      // 1. sort 구현
      // 2. 카테고리별 구현

      let { page, category, sort } = query;
      page = page ? page : 0;

      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      const user = await this.user.findById(userId);

      const sunhans = await this.sunhan
        .find(
          {
            location: {
              $nearSphere: {
                $geometry: {
                  type: "Point",
                  coordinates: [user.address.lng, user.address.lat],
                },
                $minDistance: 0,
                $maxDistance: 5000,
              },
            },
          },
          {
            location: 0,
            __v: 0,
            reviews: 0,
          }
        )
        .skip(page * 10)
        .limit(10);

      return sunhans;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async getSunhan(sunhanId) {
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

  async getSunhanMenu(sunhanId) {
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
