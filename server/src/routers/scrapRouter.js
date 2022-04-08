import express from "express";
import authJWT from "../middlewares/authJWT";

import {
  getScraps,
  patchScrap,
  deleteScrap,
} from "../controllers/scrapController";

const scrapRouter = express.Router();

// kakao 키워드로 장소 검색하기 api를 통해서 카테고리 정보 받아오기
scrapRouter.get("/", authJWT, getScraps);

// 선한영향력가게 가맹점 정보 db에 저장
scrapRouter.patch("/:id", authJWT, patchScrap);
// 아동급식카드 가맹점 정보 db에 저장
scrapRouter.delete("/:id", authJWT, deleteScrap);

export default scrapRouter;
