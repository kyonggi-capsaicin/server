import { Container } from "typedi";
import scrapService from "../services/scrapService";

const scrapServiceInstance = Container.get(scrapService);

export const getScraps = async (req, res, next) => {
  try {
    let { type } = req.query;

    type = type ? type : "sunhan";
    const scraps = await scrapServiceInstance.getScraps(req.id, type);
    return res.status(200).json({ message: "success", scraps });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const patchScrap = async (req, res, next) => {
  try {
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteScrap = async (req, res, next) => {
  try {
  } catch (error) {
    console.error(error);
    next(error);
  }
};
