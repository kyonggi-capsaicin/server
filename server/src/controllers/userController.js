import { Container } from "typedi";
import userService from "../services/userService";

const userServiceInstance = Container.get(userService);

export const getUser = async (req, res, next) => {
  try {
    console.log(req.id);
    const user = await userServiceInstance.getUser(req.id);
    return res.status(200).json({ message: "success", data: user });
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
    let { type } = req.query;
  } catch (error) {
    console.error(error);
    next(error);
  }
};
