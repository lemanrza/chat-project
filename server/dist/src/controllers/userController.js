import { getAll, login, register } from "../services/userService.js";
import formatMongoData from "../utils/formatMongoData.js";
import bcrypt from "bcrypt";
export const getUsers = async (_, res, next) => {
    try {
        const users = await getAll();
        res.status(200).json({
            message: "Users retrieved seccessfully!",
            data: formatMongoData(users),
        });
    }
    catch (error) {
        next(error);
    }
};
export const registerUser = async (req, res, next) => {
    try {
        const saltRounds = 10;
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const response = await register({
            ...req.body,
            password: hashedPassword,
        });
        if (!response.success)
            throw new Error(response.message);
        res.status(201).json({
            message: "User register successfully",
            data: formatMongoData(response.data),
        });
    }
    catch (error) {
        next(error);
    }
};
export const loginUser = async (req, res, _) => {
    try {
        const credentials = {
            email: req.body.email,
            password: req.body.password,
        };
        const response = await login(credentials);
        // res.cookie("refreshToken", response.refreshToken, {
        //   httpOnly: true,
        //   secure: true,
        //   sameSite: "strict",
        //   path: "/auth/refresh",
        //   maxAge: 7 * 24 * 60 * 60 * 1000,
        // });
        res.status(200).json({
            message: "User successfully login",
            // token: response.accessToken,
        });
    }
    catch (error) {
        res.json({
            message: error.message || "internal server error",
            statusCode: error.statusCode || 500,
        });
    }
};
