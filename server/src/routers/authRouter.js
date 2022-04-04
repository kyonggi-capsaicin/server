import express from "express";

import { naverLogin, kakaoLogin } from "../controllers/authController";

const authRouter = express.Router();

// 네이버 로그인
authRouter.get("/naver", naverLogin);
authRouter.get("/kakao", kakaoLogin);

export default authRouter;
