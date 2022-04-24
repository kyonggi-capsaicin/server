import { Service } from "typedi";
import Child from "../models/childCardShop";
import User from "../models/users";
import throwError from "../utils/throwError";
import serviceError from "../utils/serviceError";
import { isValidObjectId } from "mongoose";
import logger from "../config/logger";

@Service()
export default class childrenService {
  constructor() {
    this.child = Child;
    this.user = User;
  }

  async getAllChildrenShop(userId, query) {
    try {
      let { page, category, sort } = query;
      page = page ? page : 0;

      const variable = sort === "name" ? { name: 1 } : {};

      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      const user = await this.user.findById(userId);

      const childrenShops = await this.child
        .find(
          {
            category: category,
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

      return childrenShops;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async getAllChildrenShopGuest(query) {
    try {
      let { page, category, sort, lat, lng } = query;
      page = page ? page : 0;

      const variable = sort === "name" ? { name: 1 } : {};

      const childrenShops = await this.child
        .find(
          {
            category: category,
            location: {
              $nearSphere: {
                $geometry: {
                  type: "Point",
                  coordinates: [lng, user.address.lat],
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

      return childrenShops;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async getChildrenShop(childrenShopId) {
    try {
      if (!isValidObjectId(childrenShopId)) {
        throw throwError(400, "childrenShopId가 유효하지 않습니다.");
      }

      const childrenShop = await this.child.findById(childrenShopId, {
        __v: 0,
      });

      return childrenShop;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async getSearchChildrenShop(sunhanId) {
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
