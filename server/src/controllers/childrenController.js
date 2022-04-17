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
