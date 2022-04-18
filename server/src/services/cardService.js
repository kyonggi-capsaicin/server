import { Service } from "typedi";
import axios from "axios";
import currentDate from "../utils/currentDate";
import currentTime from "../utils/currentTime";
import User from "../models/users";
import throwError from "../utils/throwError";
import serviceError from "../utils/serviceError";
import { isValidObjectId } from "mongoose";
import logger from "../config/logger";

@Service()
export default class cardService {
  constructor() {
    this.user = User;
  }

  async getCardBalance(userId, type) {
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

  async createCard(cardDTO) {
    try {
      const headers = {
        Tsymd: currentDate(),
        Iscd: process.env.NH_ISCD,
        FintechApsno: "001",
        ApiSvcCd: "DrawingTransferA",
        AccessToken: process.env.NH_ACCESS_TOKEN,
      };

      await this.createFinAccountDirect(cardDTO, headers);
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async createFinAccountDirect(cardDTO, headers) {
    try {
      headers.Trtm = currentTime();
      headers.ApiNm = "OpenFinAccountDirect";
      headers.IsTuno = parseInt(Math.random() * 1000000000);

      console.log(headers);

      const baseUrl = "https://developers.nonghyup.com/OpenFinAccountDirect.nh";
      const { data } = await axios.post(baseUrl, {
        Header: headers,
        DrtrRgyn: "Y",
        BrdtBrno: cardDTO.birthday,
        Bncd: "011",
        Acno: cardDTO.accountNumber,
      });

      console.log("data", data);
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async deleteCard(userId, shopId, type) {
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
