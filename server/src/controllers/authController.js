import { Container } from "typedi";
import logger from "../utils/throwError";
import throwError from "../utils/throwError";
import authService from "../services/authService";

const authServiceInstance = Container.get(authService);

export const naverLogin = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return next(throwError(400, "header에 accessToken이 없습니다."));
    }

    const AccessToken = req.headers.authorization.split("Bearer ")[1];
    await verifyThirdPartyToken(
      "https://openapi.naver.com/v1/nid/verify",
      AccessToken
    );
  } catch (error) {
    logger.error(error.message);
    next(error);
  }
};

export const kakaoLogin = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return next(throwError(400, "header에 accessToken이 없습니다."));
    }

    const AccessToken = req.headers.authorization.split("Bearer ")[1];
    const result = await authServiceInstance.thirdPartyTokenApi(
      "https://kapi.kakao.com/v1/user/access_token_info",
      AccessToken
    );

    if (result.status !== 200) {
      return next(throwError(400, "accessToken이 유효하지 않습니다."));
    }

    const {
      data: {
        id,
        kakao_account: { email },
      },
    } = await authServiceInstance.thirdPartyTokenApi(
      "https://kapi.kakao.com/v2/user/me",
      AccessToken
    );

    const exUser = await authServiceInstance.exUser(email);

    if (exUser) {
      return next(throwError(400, "존재하는 email 계정입니다."));
    }

    const user = await authServiceInstance.createUser(email, id, "kakao");
    return res.status(200).json({ message: "success", data: user });
  } catch (error) {
    logger.error(error.message);
    next(error);
  }
};
