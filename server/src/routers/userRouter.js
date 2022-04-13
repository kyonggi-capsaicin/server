import express from "express";
import authJWT from "../middlewares/authJWT";
import { upload } from "../middlewares/imageUpload";

import {
  getUser,
  setAddressInfo,
  updateUser,
  blockUser,
  unblockUser,
  deleteUser,
} from "../controllers/userController";

const userRouter = express.Router();

// 유저 정보 가져오기
userRouter.get("/", authJWT, getUser);

// 유저 주소 설정
userRouter.post("/address", authJWT, setAddressInfo);

// 유저 정보 업데이트
userRouter.patch("/", authJWT, upload.single("image"), updateUser);

// 유저 차단하기
userRouter.patch("/:id/block", authJWT, blockUser);

// 유저 차단 풀기
userRouter.patch("/:id/unblock", authJWT, unblockUser);

// 탈퇴하기
userRouter.delete("/", authJWT, deleteUser);

export default userRouter;
