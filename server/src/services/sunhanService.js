import { Service } from "typedi";
import Sunhan from "../models/sunhanShop";
import User from "../models/users";
import throwError from "../utils/throwError";
import serviceError from "../utils/serviceError";
import mongoose from "mongoose";
import logger from "../config/logger";

@Service()
export default class sunhanService {
  constructor() {
    this.sunhan = Sunhan;
    this.user = User;
  }

  async getAllSunhan(userId, query) {
    try {
      let { page, category, sort } = query;
      page = page ? page : 0;

      const variable = sort === "name" ? { name: 1 } : {};

      if (!mongoose.isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      const user = await this.user.findById(userId);

      const sunhans = await this.sunhan
        .find(
          {
            category,
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
            image: 0,
            location: 0,
            __v: 0,
            reviews: 0,
            lat: 0,
            lng: 0,
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
            category,
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
            image: 0,
            location: 0,
            __v: 0,
            reviews: 0,
            lat: 0,
            lng: 0,
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
      if (!mongoose.isValidObjectId(sunhanId)) {
        throw throwError(400, "sunhanId가 유효하지 않습니다.");
      }

      const sunhan = await this.sunhan.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(sunhanId) } },
        { $unwind: "$reviews" },
        { $sort: { "reviews._id": -1 } },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            openingHours: { $first: "$openingHours" },
            address: { $first: "$address" },
            tatget: { $first: "$tatget" },
            offer: { $first: "$offer" },
            phoneNumber: { $first: "$phoneNumber" },
            category: { $first: "$category" },
            reviews: { $push: "$reviews" },
          },
        },
      ]);

      return sunhan[0];
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async getSearchSunhan(userId, query) {
    try {
      let { name, page } = query;
      page = page ? page : 0;

      if (!mongoose.isValidObjectId(userId)) {
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
                $maxDistance: 3000,
              },
            },
          },
          { image: 0, location: 0, __v: 0, reviews: 0, lat: 0, lng: 0 }
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
                $maxDistance: 3000,
              },
            },
          },
          {
            image: 0,
            location: 0,
            __v: 0,
            reviews: 0,
            lat: 0,
            lng: 0,
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

  async getAllCategory() {
    try {
      const category = await this.sunhan.find().distinct("category");
      const detailCategory = await this.sunhan
        .find()
        .distinct("detailCategory");
      return { category, detailCategory };
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }
}
