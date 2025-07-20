import { getAll, getByEmail, getOne, login, register, } from "../services/userService.js";
import formatMongoData from "../utils/formatMongoData.js";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/jwt.js";
import { sendVerificationEmail } from "../utils/sendMail.js";
import cloudinary from "cloudinary";
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
            fullName: req.body.displayName,
        }, "6h");
        const verificationLink = `${process.env.SERVER_URL}/auth/verify-email?token=${token}`;
        sendVerificationEmail(req.body.email, req.body.displayName, verificationLink);
        res.status(201).json({
            message: "User registered successfully | Verify your email",
            data: response.data,
        });
    }
    catch (error) {
        next(error);
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
        res.json({
            message: error.message || "internal server error",
            statusCode: error.statusCode || 500,
        });
    }
};
