import { NextFunction, Request, Response } from "express";
import { getAll, register } from "../services/userService.js";
import formatMongoData from "../utils/formatMongoData.js";
import bcrypt from "bcrypt";

export const getUsers = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getAll();

    res.status(200).json({
      message: "Users retrieved seccessfully!",
      data: formatMongoData(users),
    });
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const saltRounds = 10;
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const response = await register({
      ...req.body,
      password: hashedPassword,
    });

    if (!response.success) throw new Error(response.message);

    res.status(201).json({
      message: "User register successfully",
      data: formatMongoData(response.data),
    });
  } catch (error) {
    next(error);
  }
};
