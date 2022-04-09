import postService from "../services/postService";
import { Container } from "typedi";
import logger from "../config/logger";
import throwError from "../utils/throwError";

const postServiceInstance = Container.get(postService);

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await postServiceInstance.getAllPosts();
    return res.status(200).json({ message: "success", data: posts });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const { id: postId } = req.params;

    const post = await postServiceInstance.getPost(postId);
    return res.status(200).json({ message: "success", data: post });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const post = await postServiceInstance.createPost(req.id, req.body);
    return res.status(201).json({ message: "success", data: post });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { id: postId } = req.params;

    const updatedPost = await postServiceInstance.updatePost(postId, req.body);
    return res.status(200).json({ message: "success", data: updatedPost });
  } catch (error) {
    next(error);
  }
};

export const blockPost = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    await postServiceInstance.blockPost(req.id, postId);

    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
