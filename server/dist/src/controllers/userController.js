import { getAll, getByEmail, getOne, login, register, resetPass, unlockAcc, forgotPassword as forgotPasswordService, deleteUser as deleteUserService, } from "../services/userService.js";
import formatMongoData from "../utils/formatMongoData.js";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/jwt.js";
import { sendVerificationEmail } from "../utils/sendMail.js";
import cloudinary from "cloudinary";
import config from "../config/config.js";
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
export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await getOne(id);
        if (!user) {
            res.status(404).json({
                message: "no such user found!",
                data: null,
            });
        }
        else {
            res.status(200).json({
                message: "user retrieved successfully!",
                data: user,
            });
        }
    }
    catch (error) {
        next(error);
    }
};
export const getUserByEmail = async (req, res, next) => {
    try {
        const { email } = req.params;
        const user = await getByEmail(email);
        if (!user) {
            res.status(404).json({
                message: "no such user with given email",
                data: null,
            });
        }
        else {
            res.status(200).json({
                message: "user retrieved successfully!",
                data: user,
            });
        }
    }
    catch (error) {
        next(error);
    }
};
export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const response = await deleteUserService(id);
        if (!response || !response.success) {
            // In case no response or success is false (i.e. user doesn't exist)
            res.status(404).json({
                message: "No such user found!",
                data: null,
            });
        }
        else {
            res.status(200).json({
                message: response.message,
                data: null, // You can also return the deleted user's details here if needed.
            });
        }
    }
    catch (error) {
        next(error);
    }
};
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        await forgotPasswordService(email);
        res.status(200).json({
            message: "reset password email was sent!",
        });
    }
    catch (error) {
        if (error && typeof error === "object" && "message" in error) {
            next(error);
        }
        else {
            next(new Error("Internal server error"));
        }
    }
};
export const resetPassword = async (req, res, next) => {
    try {
        const { newPassword, email } = req.body;
        await resetPass(newPassword, email);
        res.status(200).json({
            message: "password reset successfully!",
        });
    }
    catch (error) {
        next(error);
    }
};
export const registerUser = async (req, res, next) => {
    try {
        // Password hash
        const { password } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        if (req.file) {
            const uploadedImage = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: "user_profiles",
            });
            req.body.profile = uploadedImage.secure_url;
            req.body.public_id = uploadedImage.public_id;
        }
        const response = await register({
            ...req.body,
            password: hashedPassword,
        });
        if (!response.success) {
            throw new Error(response.message);
        }
        // Send email service ...
        const token = generateAccessToken({
            id: response.data._id,
            email: req.body.email,
            fullName: req.body.profile.displayName,
        }, "6h");
        const verificationLink = `${process.env.SERVER_URL}/auth/verify-email?token=${token}`;
        sendVerificationEmail(req.body.email, req.body.profile.displayName, verificationLink);
        res.status(201).json({
            message: "User registered successfully | Verify your email",
            data: response.data,
        });
    }
    catch (error) {
        if (error && typeof error === "object" && "message" in error) {
            next(error);
        }
        else {
            next(new Error("Internal server error"));
        }
    }
};
export const loginUser = async (req, res, next) => {
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
    }
    catch (error) {
        let message = "internal server error";
        let statusCode = 500;
        if (error && typeof error === "object" && "message" in error) {
            message = error.message;
            if ("statusCode" in error) {
                statusCode = error.statusCode;
            }
        }
        res.json({
            message,
            statusCode,
        });
    }
};
export const unlockAccount = async (req, res, next) => {
    try {
        const { token } = req.query;
        const response = await unlockAcc(token);
        res.redirect(`${config.CLIENT_URL}/auth/login?message=${response.message}`);
    }
    catch (error) {
        next(error);
    }
};
export const logout = (_, res) => {
    res.clearCookie("refreshToken", { path: "/auth/refresh" });
    res.status(204).json({ message: "logged out successfully!" });
};
