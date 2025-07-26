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
} from "../controllers/userController.js";
import userValidate from "../middlewares/userValidate.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.post("/register", userValidate, registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/unlock-account", unlockAccount);
userRouter.get("/verify-email", verifyUserEmail);

userRouter.get("/me/:userId", getCurrentUser);
userRouter.put("/me/:userId", updateCurrentUser);
userRouter.delete("/me/:userId", deleteCurrentUser);
userRouter.post("/me/:userId/change-password", changePassword);
userRouter.post(
  "/me/:userId/upload-image",
  upload.single("avatar"),
  uploadProfileImage
);
userRouter.delete("/me/:userId/delete-image", deleteProfileImage);

// Connection management routes
userRouter.get("/me/:userId/available", getAvailableUsersToConnect);
userRouter.post("/me/:userId/connections", addUserConnection);
userRouter.delete(
  "/me/:userId/connections/:connectionId",
  removeUserConnection
);

// Connection request management routes
userRouter.post("/me/:userId/connections/accept", acceptConnection);
userRouter.post("/me/:userId/connections/reject", rejectConnection);

userRouter.get("/:id", getUserById);
userRouter.put("/update/:id", updateUserController);
userRouter.delete("/:id", deleteUser);

export default userRouter;
