import request from "../core";
import Child from "../models/childCardShop";
import Sunhan from "../models/sunhanShop";

export default class dataService {
  async allContentList(baseUrl) {
    try {
      const data = await request.get(baseUrl);
      return data.data.body;
    } catch (error) {
      console.error(error);
    }
  }

  async detailContent(contents) {
    (async () => {
      for (let content of contents) {
        try {
          let baseUrl = `https://map.seoul.go.kr/smgis/apps/poi.do?cmd=getNewContentsDetail&key=${process.env.SUNHAN_API_KEY}&theme_id=11102795&conts_id=${content.cot_conts_id}`;
          const data = await request.get(baseUrl);

          const {
            COT_VALUE_03,
            COT_VALUE_05,
            COT_COORD_Y,
            COT_COORD_X,
            COT_VALUE_01,
            COT_VALUE_02,
            COT_CONTS_NAME,
            COT_TEL_NO,
            COT_IMG_MAIN_URL,
          } = data.data.body[0];

          const sunhan = new Sunhan({
            name: COT_CONTS_NAME,
            openingHours: COT_VALUE_01,
            address: COT_VALUE_05,
            tatget: COT_VALUE_03,
            offer: COT_VALUE_02,
            lat: COT_COORD_X,
            lng: COT_COORD_Y,
            phoneNumber: COT_TEL_NO,
            image: COT_IMG_MAIN_URL,
          });

          await sunhan.save();
        } catch (error) {
          console.error(error);
        }
      }
    })();
  }

  async allChildList(baseUrl) {
    try {
      const {
        data: {
          response: {
            body: { items },
          },
        },
      } = await request.get(baseUrl);

      const result = [];

      for (let i = 0; i < items.length; i++) {
        const {
          mrhstNm,
          mrhstCode,
          ctprvnNm,
          signguNm,
          signguCode,
          rdnmadr,
          latitude,
          longitude,
          phoneNumber,
          weekdayOperOpenHhmm,
          weekdayOperColseHhmm,
          satOperOperOpenHhmm,
          satOperCloseHhmm,
          holidayOperOpenHhmm,
          holidayCloseOpenHhmm,
        } = items[i];

        const child = new Child({
          name: mrhstNm,
          code: mrhstCode,
          cityName: ctprvnNm,
          fullCityName: signguNm,
          fullCityNameCode: signguCode,
          address: rdnmadr,
          lat: latitude,
          lng: longitude,
          phoneNumber: phoneNumber,
          weekdayStartTime: weekdayOperOpenHhmm,
          weekdayEndTime: weekdayOperColseHhmm,
          weekendStartTime: satOperOperOpenHhmm,
          weekendEndTime: satOperCloseHhmm,
          holydayStartTime: holidayOperOpenHhmm,
          holydayEndTime: holidayCloseOpenHhmm,
        });

        result.push(child);
      }

      await Child.insertMany(result);
    } catch (error) {
      console.error(error);
    }
  }
}
