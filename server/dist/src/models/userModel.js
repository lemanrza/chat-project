import mongoose from "mongoose";
import userSchema from "../schemas/userSchema";
const UserModel = mongoose.model("User", userSchema);
export default UserModel;
