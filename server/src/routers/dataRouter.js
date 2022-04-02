import express from "express";

import { createSunhan, createChild } from "../controllers/dataControllers";

const dataRouter = express.Router();

// 선한영향력가게 가맹점 정보 db에 저장
dataRouter.post("/sunhan", createSunhan);
// 아동급식카드 가맹점 정보 db에 저장
dataRouter.post("/child", createChild);
export default dataRouter;
