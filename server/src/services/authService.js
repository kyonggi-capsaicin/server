import { Service } from "typedi";
import axios from "axios";
import User from "../models/users";
import logger from "../config/logger";

@Service()
export default class authService {
  constructor() {
    this.user = User;
  }

  async thirdPartyTokenApi(baseUrl, accessToken = null) {
    try {
      const data = await axios.get(baseUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return data;
    } catch (error) {
      logger.error(error.message);
    }
  }

  async exUser(email) {
    try {
      const exUser = await this.user.findOne({ email });
      return exUser;
    } catch (error) {
      console.error(error);
      throw Error(error.message);
    }
  }

  async createUser(email, id, type) {
    try {
      let user;

      if (type === "kakao") {
        user = await this.user.create({
          email,
          kakaoId: id,
          nickname: `선한${parseInt(Math.random() * 100000)}`,
        });
      }

      return user;
    } catch (error) {
      console.error(error);
      throw Error(error.message);
    }
  }
}
