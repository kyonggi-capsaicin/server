import DataService from "../services/dataService";

export const createSunhan = async (req, res, next) => {
  try {
    const dataService = new DataService();

    const baseUrl = `https://map.seoul.go.kr/smgis/apps/theme.do?cmd=getContentsListAll&key=${process.env.SUNHAN_API_KEY}&theme_id=11102795`;
    // 모든 선한영향력가게의 conts_id 받아오기
    const data = await dataService.allContentList(baseUrl);
    // 선한영향력가게 디테일 정보 db에 저장
    await dataService.detailContent(data);
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createChild = async (req, res, next) => {
  try {
    const { page } = req.body;
    const baseUrl = `http://api.data.go.kr/openapi/tn_pubr_public_chil_wlfare_mlsv_api?serviceKey=${process.env.CHILD_API_KEY}&pageNo=${page}&numOfRows=1000&type=json`;

    // 모든 아동급식카드가맹점 정보 db에 저장
    await new DataService().allChildList(baseUrl);
    res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};
