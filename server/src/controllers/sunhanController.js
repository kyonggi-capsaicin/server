import { Container } from "typedi";
import sunhanService from "../services/sunhanService";

const sunhanServiceInstance = Container.get(sunhanService);

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

export const getSunhanMenu = async (req, res, next) => {
  try {
    const { id: sunhanId } = req.params;

    const sunhanMenu = await sunhanServiceInstance.getSunhanMenu(sunhanId);
    return res.status(200).json({ message: "success", data: sunhanMenu });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
