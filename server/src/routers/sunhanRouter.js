import express from "express";
import authJWT from "../middlewares/authJWT";

import { getSunhan } from "../controllers/sunhanController";

const sunhanRouter = express.Router();

// 특정 선한 영향력 가게 가져오기
sunhanRouter.get("/:id", getSunhan);

export default sunhanRouter;
