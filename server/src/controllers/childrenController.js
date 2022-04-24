import { Container } from "typedi";
import childrenService from "../services/childrenService";

const childrenServiceInstance = Container.get(childrenService);

export const getAllChildrenShop = async (req, res, next) => {
  try {
    const childrenShops = await childrenServiceInstance.getAllChildrenShop(
      req.id,
      req.query
    );

    return res.status(200).json({ message: "success", data: childrenShops });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllChildrenShopGuest = async (req, res, next) => {
  try {
    const childrenShops = await childrenServiceInstance.getAllChildrenShopGuest(
      req.query
    );

    return res.status(200).json({ message: "success", data: childrenShops });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getChildrenShop = async (req, res, next) => {
  try {
    const { id: childrenShopId } = req.params;

    const childrenShop = await childrenServiceInstance.getChildrenShop(
      childrenShopId
    );

    return res.status(200).json({ message: "success", data: childrenShop });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getSearchChildrenShop = async (req, res, next) => {
  try {
    const childrenShops = await childrenServiceInstance.getSearchChildrenShop(
      req.id,
      req.query
    );

    return res.status(200).json({ message: "success", data: childrenShops });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getSearchChildrenShopGuest = async (req, res, next) => {
  try {
    const { id: sunhanId } = req.params;

    const sunhanMenu = await childrenServiceInstance.getSearchChildrenShop(
      sunhanId
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
