import express from "express";
import {
  deleteUser,
  getUserById,
  getUsers,
  loginUser,
  registerUser,
  unlockAccount,
  updateCurrentUser,
  getCurrentUser,
  uploadProfileImage,
  deleteProfileImage,
  upload,
  changePassword,
  deleteCurrentUser,
  verifyUserEmail,
  addUserConnection,
  removeUserConnection,
  getAvailableUsersToConnect,
  updateUserController,
  acceptConnection,
  rejectConnection,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";
import userValidate from "../middlewares/userValidate.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.post("/register", userValidate, registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/unlock-account", unlockAccount);
userRouter.get("/verify-email", verifyUserEmail);

userRouter.get("/me/:userId", authenticateToken, getCurrentUser);
userRouter.put("/me/:userId", authenticateToken, updateCurrentUser);
userRouter.delete("/me/:userId", authenticateToken, deleteCurrentUser);
userRouter.post(
  "/me/:userId/change-password",
  authenticateToken,
  changePassword
);
userRouter.post(
  "/me/:userId/upload-image",
  authenticateToken,
  upload.single("avatar"),
  uploadProfileImage
);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post("/reset-password", resetPassword);

userRouter.delete(
  "/me/:userId/delete-image",
  authenticateToken,
  deleteProfileImage
);

// Connection management routes
userRouter.get(
  "/me/:userId/available",
  authenticateToken,
  getAvailableUsersToConnect
);
userRouter.post(
  "/me/:userId/connections",
  authenticateToken,
  addUserConnection
);
userRouter.delete(
  "/me/:userId/connections/:connectionId",
  authenticateToken,
  removeUserConnection
);

// Connection request management routes
userRouter.post("/me/:userId/connections/accept", acceptConnection);
userRouter.post("/me/:userId/connections/reject", rejectConnection);

userRouter.get("/:id", getUserById);
userRouter.put("/update/:id", updateUserController);
userRouter.delete("/:id", deleteUser);

export default userRouter;
