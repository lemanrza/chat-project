import express from "express";
import {
  getUsers,
  loginUser,
  registerUser,
  unlockAccount,
} from "../controllers/userController.js";
import userValidate from "../middlewares/userValidate.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.post("/register", userValidate, registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/unlock-account", unlockAccount);
export default userRouter;
