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

      const variable = sort === "name" ? { name: 1 } : {};

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
        .limit(10)
        .sort(variable);

      return sunhans;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async getAllSunhanGuest(query) {
    try {
      // todo
      // 1. 카테고리별 구현

      let { lat, lng, page, category, sort } = query;
      page = page ? page : 0;

      const variable = sort === "name" ? { name: 1 } : {};

      const sunhans = await this.sunhan
        .find(
          {
            location: {
              $nearSphere: {
                $geometry: {
                  type: "Point",
                  coordinates: [lng, lat],
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
        .limit(10)
        .sort(variable);

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

  async getSearchSunhan(userId, query) {
    try {
      let { name, page } = query;
      page = page ? page : 0;

      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      const user = await this.user.findById(userId);

      const sunhans = await this.sunhan
        .find(
          {
            name: { $regex: name, $options: "i" },
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

  async getSearchSunhanGuest(query) {
    try {
      let { lat, lng, name, page } = query;
      page = page ? page : 0;

      const sunhans = await this.sunhan
        .find(
          {
            name: { $regex: name, $options: "i" },
            location: {
              $nearSphere: {
                $geometry: {
                  type: "Point",
                  coordinates: [lng, lat],
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
}
