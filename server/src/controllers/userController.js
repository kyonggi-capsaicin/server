import { Container } from "typedi";
import userService from "../services/userService";

const userServiceInstance = Container.get(userService);

export const getUser = async (req, res, next) => {
  try {
    const user = await userServiceInstance.getUser(req.id);
    return res.status(200).json({ message: "success", data: user });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getBlockUserList = async (req, res, next) => {
  try {
    const userBlockList = await userServiceInstance.getBlockUserList(req.id);
    return res.status(200).json({ message: "success", data: userBlockList });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getUserWritePosts = async (req, res, next) => {
  try {
    let { page } = req.query;
    page = page ? page : 0;

    const posts = await userServiceInstance.getUserWritePosts(req.id, page);
    return res.status(200).json({ message: "success", data: posts });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getUserWriteComments = async (req, res, next) => {
  try {
    let { page } = req.query;

    page = page ? page : 0;
    const comments = await userServiceInstance.getUserWriteComments(
      req.id,
      page
    );
    return res.status(200).json({ message: "success", data: comments });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getUserWriteReviews = async (req, res, next) => {
  try {
    let { page } = req.query;
    page = page ? page : 0;

    const reviews = await userServiceInstance.getUserWriteReviews(req.id, page);
    return res.status(200).json({ message: "success", data: reviews });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const setAddressInfo = async (req, res, next) => {
  try {
    await userServiceInstance.setAddressInfo(req.id, req.body);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    let filename = null;
    if (req.file) {
      filename = req.file.filename;
    }

    await userServiceInstance.updateUser(req.id, req.body, filename);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const blockUser = async (req, res, next) => {
  try {
    const { id: blockUserId } = req.params;

    await userServiceInstance.blockUser(req.id, blockUserId);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const unblockUser = async (req, res, next) => {
  try {
    const { id: blockUserId } = req.params;
    await userServiceInstance.unblockUser(req.id, blockUserId);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await userServiceInstance.deleteUser(req.id);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
