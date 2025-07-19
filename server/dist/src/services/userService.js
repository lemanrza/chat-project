import UserModel from "../models/userModel.js";
export const getAll = async () => await UserModel.find().select("-password");
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
        return error.message || "Internal server error";
    }
};
