import { Service } from "typedi";
import Child from "../models/childCardShop";
import User from "../models/users";
import throwError from "../utils/throwError";
import serviceError from "../utils/serviceError";
import mongoose from "mongoose";
import logger from "../config/logger";

@Service()
export default class childrenService {
  constructor() {
    this.child = Child;
    this.user = User;
  }

  async getAllChildrenShop(userId, query) {
    try {
      let { page, sort } = query;
      page = page ? page : 0;

      const variable = sort === "name" ? { name: 1 } : {};

      if (!mongoose.isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      const user = await this.user.findById(userId);

      const childrenShops = await this.child
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
            __v: 0,
            location: 0,
            fullCityNameCode: 0,
            code: 0,
            cityName: 0,
            fullCityName: 0,
            lat: 0,
            lng: 0,
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
      let { page, sort, lat, lng } = query;
      page = page ? page : 0;

      const variable = sort === "name" ? { name: 1 } : {};

      const childrenShops = await this.child
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
            __v: 0,
            location: 0,
            fullCityNameCode: 0,
            code: 0,
            cityName: 0,
            fullCityName: 0,
            lat: 0,
            lng: 0,
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
      if (!mongoose.isValidObjectId(childrenShopId)) {
        throw throwError(400, "childrenShopId가 유효하지 않습니다.");
      }

      const childrenShop = await this.child.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(childrenShopId) } },
        { $unwind: "$reviews" },
        { $sort: { "reviews._id": -1 } },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            address: { $first: "$address" },
            phoneNumber: { $first: "$phoneNumber" },
            weekdayStartTime: { $first: "$weekdayStartTime" },
            weekdayEndTime: { $first: "$weekdayEndTime" },
            weekendStartTime: { $first: "$weekendStartTime" },
            weekendEndTime: { $first: "$weekendEndTime" },
            holydayStartTime: { $first: "$holydayStartTime" },
            holydayEndTime: { $first: "$holydayEndTime" },
            category: { $first: "$category" },
            reviews: { $push: "$reviews" },
          },
        },
      ]);

      return childrenShop[0];
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async getSearchChildrenShop(userId, query) {
    try {
      const { name, page } = query;

      if (!mongoose.isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      const user = await this.user.findById(userId);

      const childrenShops = await this.child
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
                $maxDistance: 3000,
              },
            },
          },
          {
            __v: 0,
            location: 0,
            fullCityNameCode: 0,
            code: 0,
            cityName: 0,
            fullCityName: 0,
            lat: 0,
            lng: 0,
          }
        )
        .skip(page * 10)
        .limit(10);

      return childrenShops;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async getSearchChildrenShopGuest(query) {
    try {
      const { name, page, lat, lng } = query;

      const childrenShops = await this.child
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
                $maxDistance: 3000,
              },
            },
          },
          {
            __v: 0,
            location: 0,
            fullCityNameCode: 0,
            code: 0,
            cityName: 0,
            fullCityName: 0,
            lat: 0,
            lng: 0,
          }
        )
        .skip(page * 10)
        .limit(10);

      return childrenShops;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async getAllCategory() {
    try {
      const category = await this.child.find().distinct("category");
      const detailCategory = await this.child.find().distinct("detailCategory");
      return { category, detailCategory };
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }
}
