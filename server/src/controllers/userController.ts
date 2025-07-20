import { NextFunction, Request, Response } from "express";
import {
  getAll,
  getByEmail,
  getOne,
  login,
  register,
} from "../services/userService.js";
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

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await getOne(id);
    if (!user) {
      res.status(404).json({
        message: "no such user found!",
        data: null,
      });
    } else {
      res.status(200).json({
        message: "user retrieved successfully!",
        data: user,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;
    const user = await getByEmail(email);
    if (!user) {
      res.status(404).json({
        message: "no such user with given email",
        data: null,
      });
    } else {
      res.status(200).json({
        message: "user retrieved successfully!",
        data: user,
      });
    }
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

export const loginUser = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  try {
    const credentials = {
      email: req.body.email,
      password: req.body.password,
    };
    const response = await login(credentials);

    res.cookie("refreshToken", response.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "User successfully login",
      token: response.accessToken,
    });
  } catch (error: any) {
    res.json({
      message: error.message || "internal server error",
      statusCode: error.statusCode || 500,
    });
  }
};
