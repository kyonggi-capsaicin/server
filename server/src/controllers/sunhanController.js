import { Container } from "typedi";
import sunhanService from "../services/sunhanService";

const sunhanServiceInstance = Container.get(sunhanService);

export const getAllSunhan = async (req, res, next) => {
  try {
    const sunhans = await sunhanServiceInstance.getAllSunhan(req.id, req.query);
    return res.status(200).json({ message: "success", data: sunhans });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllSunhanGuest = async (req, res, next) => {
  try {
    const sunhans = await sunhanServiceInstance.getAllSunhanGuest(req.query);
    return res.status(200).json({ message: "success", data: sunhans });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getSunhan = async (req, res, next) => {
  try {
    const { id: sunhanId } = req.params;

    const sunhan = await sunhanServiceInstance.getSunhan(sunhanId);

    return res.status(200).json({ message: "success", data: sunhan });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getSearchSunhan = async (req, res, next) => {
  try {
    const sunhanMenu = await sunhanServiceInstance.getSearchSunhan(
      req.id,
      req.query
    );

    return res.status(200).json({ message: "success", data: sunhanMenu });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getSearchSunhanGuest = async (req, res, next) => {
  try {
    const sunhanMenu = await sunhanServiceInstance.getSearchSunhanGuest(
      req.query
    );

    return res.status(200).json({ message: "success", data: sunhanMenu });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllCategory = async (req, res, next) => {
  try {
    const { category, detailCategory } =
      await sunhanServiceInstance.getAllCategory();
    return res
      .status(200)
      .json({ message: "success", data: { category, detailCategory } });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
