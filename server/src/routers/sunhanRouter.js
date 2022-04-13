import express from "express";
import authJWT from "../middlewares/authJWT";

import { getSunhan, getSunhanMenu } from "../controllers/sunhanController";

const sunhanRouter = express.Router();

// TODO
// 1. 선한영향력가게 범주화 진행 후 카테고리 관련 API
// 2. 이름 검색 API
// 3. 아동급식카드 가맹점 API 제작

// 특정 선한 영향력 가게 가져오기
sunhanRouter.get("/:id", getSunhan);

// 특정 선한 영향력 가게 메뉴 가져오기
sunhanRouter.get("/:id/menu", getSunhanMenu);

sunhanRouter.get("/:id/info", getSunhan);

// 특정 선한 영향력 가게 가져오기
sunhanRouter.get("/:id", getSunhan);

// 특정 선한 영향력 가게 가져오기
sunhanRouter.get("/:id", getSunhan);

// 특정 선한 영향력 가게 가져오기
sunhanRouter.get("/:id", getSunhan);

// 특정 선한 영향력 가게 가져오기
sunhanRouter.get("/:id", getSunhan);

export default sunhanRouter;
