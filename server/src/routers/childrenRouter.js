import express from "express";
import authJWT from "../middlewares/authJWT";

import {
  getAllChildrenShop,
  getChildrenShop,
  getSearchChildrenShop,
} from "../controllers/childrenController";

const childrenRouter = express.Router();

// TODO
// 1. 선한영향력가게 범주화 진행 후 카테고리 관련 API
// 2. 이름 검색 API
// 3. 아동급식카드 가맹점 API 제작

// 카테고리별 선한 영향력 가게 가져오기
childrenRouter.get("/", authJWT, getAllChildrenShop);

// 특정 선한 영향력 가게 가져오기
childrenRouter.get("/:id", getChildrenShop);

// 검색 api
childrenRouter.get("/search", getSearchChildrenShop);

export default childrenRouter;
