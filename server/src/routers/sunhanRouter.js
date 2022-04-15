import express from "express";
import authJWT from "../middlewares/authJWT";

import {
  getSunhan,
  getSearchSunhan,
  getAllSunhan,
} from "../controllers/sunhanController";

const sunhanRouter = express.Router();

// TODO
// 1. 선한영향력가게 범주화 진행 후 카테고리 관련 API
// 2. 이름 검색 API
// 3. 아동급식카드 가맹점 API 제작

// 카테고리별 선한 영향력 가게 가져오기
sunhanRouter.get("/", authJWT, getAllSunhan);

// 특정 선한 영향력 가게 가져오기
sunhanRouter.get("/:id", getSunhan);

// 검색 api
sunhanRouter.get("/search", getSearchSunhan);

export default sunhanRouter;
