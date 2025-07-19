import UserModel from "../models/userModel";

export const getAll = async () => await UserModel.find().select("-password");
