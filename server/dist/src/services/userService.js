import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import { generateAccessToken, generateRefreshToken, verifyAccessToken, } from "../utils/jwt.js";
import { sendForgotPasswordEmail, sendUnlockAccountEmail, } from "../utils/sendMail.js";
import config from "../config/config.js";
const CLIENT_URL = config.CLIENT_URL;
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 10 * 60 * 1000;
export const getAll = async () => await UserModel.find().select("-password").populate({
    path: "connections",
    select: "-password",
});
export const getOne = async (id) => await UserModel.findById(id).select("-password");
export const getOneWithConnections = async (id) => await UserModel.findById(id).select("-password").populate({
    path: "connections",
    select: "-password",
});
// Add a connection between two users
export const addConnection = async (userId, connectionId) => {
    try {
        // Add connection to both users
        await UserModel.findByIdAndUpdate(userId, {
            $addToSet: { connections: connectionId }
        });
        await UserModel.findByIdAndUpdate(connectionId, {
            $addToSet: { connections: userId }
        });
        return {
            success: true,
            message: "Connection added successfully"
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message || "Failed to add connection"
        };
    }
};
// Remove a connection between two users
export const removeConnection = async (userId, connectionId) => {
    try {
        // Remove connection from both users
        await UserModel.findByIdAndUpdate(userId, {
            $pull: { connections: connectionId }
        });
        await UserModel.findByIdAndUpdate(connectionId, {
            $pull: { connections: userId }
        });
        return {
            success: true,
            message: "Connection removed successfully"
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message || "Failed to remove connection"
        };
    }
};
// Get all users except current user and their connections
export const getAvailableUsers = async (userId) => {
    try {
        const currentUser = await UserModel.findById(userId).select("connections");
        const excludeIds = [userId, ...(currentUser?.connections || [])];
        const availableUsers = await UserModel.find({
            _id: { $nin: excludeIds }
        }).select("-password");
        return {
            success: true,
            data: availableUsers
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message || "Failed to get available users"
        };
    }
};
export const getOneWithPassword = async (id) => await UserModel.findById(id);
export const getByEmail = async (email) => await UserModel.find({ email: email }).select("-password");
export const deleteUser = async (id) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(id);
        if (!deletedUser) {
            return null;
        }
        return {
            success: true,
            message: "User deleted successfully",
        };
    }
    catch (error) {
        let message = "Internal server error";
        if (error && typeof error === "object" && "message" in error) {
            message = error.message;
        }
        return {
            success: false,
            message,
        };
    }
};
export const updateUser = async (id, payload) => {
    try {
        const user = await UserModel.findByIdAndUpdate(id, payload, { new: true });
        if (!user) {
            return {
                success: false,
                message: "User not found",
            };
        }
        return {
            success: true,
            data: user,
        };
    }
    catch (error) {
        let message = "Internal server error";
        if (error && typeof error === "object" && "message" in error) {
            message = error.message;
        }
        return {
            success: false,
            message,
        };
    }
};
export const register = async (payload) => {
    try {
        const { email, username } = payload;
        const dublicateUser = await UserModel.findOne({
            $or: [{ email }, { username }],
        });
        if (dublicateUser) {
            return {
                success: false,
                message: "Username or email already exist",
            };
        }
        return {
            success: true,
            data: await UserModel.create(payload),
        };
    }
    catch (error) {
        let message = "Internal server error";
        if (error && typeof error === "object" && "message" in error) {
            message = error.message;
        }
        return message;
    }
};
export const verifyEmail = async (token) => {
    const isValidToken = verifyAccessToken(token);
    if (isValidToken) {
        const { id } = isValidToken;
        const user = await UserModel.findById(id);
        if (user) {
            if (user.emailVerified) {
                return {
                    success: false,
                    message: "email already has been verified",
                };
            }
            else {
                user.emailVerified = true;
                await user.save();
                return {
                    success: true,
                    message: "email has been verified successfully!",
                };
            }
        }
    }
    else {
        throw new Error("invalid or expired token!");
    }
};
export const login = async (credentials) => {
    const { email, password } = credentials;
    const user = await UserModel.findOne({ email });
    if (!user)
        throw new Error("Invalid credentials");
    if (!user.emailVerified)
        throw new Error("User should be verified first");
    if (user.lockUntil && user.lockUntil > new Date()) {
        const unlockTime = new Date(user.lockUntil).toLocaleString();
        throw new Error(`User is locked. Try again after ${unlockTime}`);
    }
    if (user.provider == "google") {
        throw new Error("This account has been created with Google, please try sign in with Google");
    }
    else if (user.provider == "github") {
        throw new Error("This account has been created with GitHub, please try sign in with GitHub");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        user.loginAttempts = (user.loginAttempts || 0) + 1;
        if (user.loginAttempts >= MAX_ATTEMPTS) {
            user.lockUntil = new Date(Date.now() + LOCK_TIME);
            await user.save();
            //send email
            const token = generateAccessToken({
                id: user.id,
                email: user.email,
                fullName: user.profile.displayName,
            }, "6h");
            const unlockAccountLink = `${config.SERVER_URL}/auth/unlock-account?token=${token}`;
            sendUnlockAccountEmail(user.email, user.profile.displayName, user.lockUntil, unlockAccountLink);
            throw new Error("Too many login attempts. Account locked for 10 minutes. Check your email");
        }
        await user.save();
        throw new Error("Invalid credentials");
    }
    user.loginAttempts = 0;
    user.isBanned = false;
    user.lastLogin = new Date();
    await user.save();
    const accessToken = generateAccessToken({
        email: user.email,
        id: user.id,
        fullName: user.profile.displayName,
    });
    const refreshToken = generateRefreshToken({
        email: user.email,
        id: user.id,
        fullName: user.profile.displayName,
    });
    return {
        message: "User login successfully!",
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
};
export const unlockAcc = async (token) => {
    const isValidToken = verifyAccessToken(token);
    if (isValidToken && isValidToken.id) {
        const { id } = isValidToken;
        const user = await UserModel.findById(id);
        if (user?.loginAttempts >= 5) {
            user.loginAttempts = 0;
            user.lockUntil = null;
            await user.save();
            return {
                message: "Account has been unlock manually successfully",
            };
        }
        else {
            return {
                message: "Account already has been unlocked",
            };
        }
    }
    else {
        throw new Error("Invalid or expired token");
    }
};
export const forgotPassword = async (email) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new Error("email does not exist!");
    }
    else {
        const token = generateAccessToken({
            id: user._id,
            email: user.email,
        }, "30m");
        const resetPasswordLink = `${CLIENT_URL}/auth/reset-password/${token}`;
        sendForgotPasswordEmail(email, resetPasswordLink);
    }
};
export const resetPass = async (newPassword, email) => {
    const user = await UserModel.findOne({ email: email });
    if (!user)
        throw new Error("user not found!");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    console.log("inside service: ", newPassword);
    user.password = hashedPassword;
    await user.save();
    return user;
};
