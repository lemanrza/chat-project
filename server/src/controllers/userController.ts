import { NextFunction, Request, Response } from "express";
import { getAll } from "../services/userService";

export const getUsers = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getAll();

    res.status(200).json({
      message: "Users retrieved seccessfully!",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
