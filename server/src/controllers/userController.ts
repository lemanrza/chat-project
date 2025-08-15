import { NextFunction, Request, Response } from "express";
import {
  getAll,
  getByEmail,
  getOne,
  getOneWithPassword,
  getOneWithConnections,
  login,
  register,
  resetPass,
  unlockAcc,
  forgotPassword as forgotPasswordService,
  deleteUser as deleteUserService,
  updateUser,
  verifyEmail,
  addConnection,
  removeConnection,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getAvailableUsers,
} from "../services/userService.js";
import formatMongoData from "../utils/formatMongoData.js";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/jwt.js";
import { sendVerificationEmail } from "../utils/sendMail.js";
import cloudinary from "../config/cloudinaryConfig.js";
import config from "../config/config.js";
import multer from "multer";
import path from "path";
import { AuthenticatedRequest, MulterRequest } from "../types/userType.js";
import UserModel from "../models/userModel.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export const getUsers = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getAll();

    res.status(200).json({
      message: "Users retrieved seccessfully!",
      data: formatMongoData(users),
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await getOne(id);
    if (!user) {
      res.status(404).json({
        message: "no such user found!",
        data: null,
      });
    } else {
      res.status(200).json({
        message: "user retrieved successfully!",
        data: user,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;
    const user = await getByEmail(email);
    if (!user) {
      res.status(404).json({
        message: "no such user with given email",
        data: null,
      });
    } else {
      res.status(200).json({
        message: "user retrieved successfully!",
        data: user,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const response = await deleteUserService(id);

    if (!response || !response.success) {
      res.status(404).json({
        message: "No such user found!",
        data: null,
      });
    } else {
      res.status(200).json({
        message: response.message,
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    await forgotPasswordService(email);
    res.status(200).json({
      message: "reset password email was sent!",
    });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "message" in error) {
      next(error);
    } else {
      next(new Error("Internal server error"));
    }
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { newPassword, email } = req.body;
    await resetPass(newPassword, email);
    res.status(200).json({
      message: "password reset successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, profile, hobbies, ...otherData } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const profileData: any = {
      ...profile,
    };

    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_profiles",
      });

      profileData.avatar = uploadedImage.secure_url;
      profileData.public_id = uploadedImage.public_id;
    }

    const userData = {
      ...otherData,
      password: hashedPassword,
      profile: profileData,
      hobbies: hobbies || [],
    };

    const response: any = await register(userData);

    if (!response.success) {
      throw new Error(response.message);
    }

    const token = generateAccessToken(
      {
        id: response.data._id,
        email: req.body.email,
        fullName: `${req.body.profile.firstName} ${req.body.profile.lastName}`,
      },
      "6h"
    );

    const verificationLink = `${process.env.SERVER_URL}/auth/verify-email?token=${token}`;
    sendVerificationEmail(
      req.body.email,
      req.body.profile.firstName + " " + req.body.profile.lastName,
      verificationLink
    );
    res.status(201).json({
      message: "User registered successfully | Verify your email",
      data: response.data,
    });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "message" in error) {
      next(error);
    } else {
      next(new Error("Internal server error"));
    }
  }
};

export const verifyUserEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.query;

    const response = await verifyEmail(token);

    res.redirect(
      `${config.CLIENT_URL}/auth/email-verified?message=${response?.message}`
    );
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
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
  } catch (error: unknown) {
    let message = "internal server error";
    let statusCode = 500;
    if (error && typeof error === "object" && "message" in error) {
      message = (error as any).message;
      if ("statusCode" in error) {
        statusCode = (error as any).statusCode;
      }
    }
    res.json({
      message,
      statusCode,
    });
  }
};

export const unlockAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.query;

    const response = await unlockAcc(token);

    res.redirect(`${config.CLIENT_URL}/auth/login?message=${response.message}`);
  } catch (error) {
    next(error);
  }
};

export const logout = (_: Request, res: Response) => {
  res.clearCookie("refreshToken", { path: "/auth/refresh" });
  res.status(204).json({ message: "logged out successfully!" });
};

export const updateCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const user: any = await getOne(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const files = req.files as {
      profileImage?: Express.Multer.File[];
    };

    const updatedFields: any = { ...req.body };

    if (files?.profileImage?.[0]) {
      const defaultAvatarUrl =
        "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png";

      if (
        user.profile?.avatar &&
        user.profile.avatar !== defaultAvatarUrl &&
        user.profile.avatar.includes("cloudinary.com")
      ) {
        try {
          const avatarUrl = user.profile.avatar;
          const urlParts = avatarUrl.split("/");
          const fileWithExtension = urlParts[urlParts.length - 1];
          const publicId = `user_profiles/${fileWithExtension.split(".")[0]}`;

          await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryError) {
          console.error(
            "Error deleting old avatar from Cloudinary:",
            cloudinaryError
          );
        }
      }

      try {
        const uploadResult = await cloudinary.uploader.upload(
          files.profileImage[0].path,
          {
            folder: "user_profiles",
            public_id: `user_${userId}_${Date.now()}`,
            transformation: [
              { width: 400, height: 400, crop: "fill", gravity: "face" },
              { quality: "auto" },
            ],
          }
        );

        if (!updatedFields.profile) {
          updatedFields.profile = {};
        }
        updatedFields.profile.avatar = uploadResult.secure_url;
        updatedFields.profile.public_id = uploadResult.public_id;
        updatedFields.profile.updatedAt = new Date();
      } catch (uploadError) {
        console.error("Error uploading new avatar to Cloudinary:", uploadError);
        return res.status(500).json({
          message: "Failed to upload profile image",
        });
      }
    }

    const response = await updateUser(userId, updatedFields);

    if (!response.success) {
      return res.status(404).json({
        message: response.message,
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      data: response.data,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadProfileImage = async (
  req: MulterRequest,
  res: Response,
  _: NextFunction
) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No image file provided",
      });
    }

    const currentUser = await getOne(userId);
    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const defaultAvatarUrl =
      "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png";

    if (
      currentUser.profile?.avatar &&
      currentUser.profile.avatar !== defaultAvatarUrl
    ) {
      const avatarUrl = currentUser.profile.avatar;
      if (avatarUrl.includes("cloudinary.com")) {
        try {
          let publicId = currentUser.profile?.public_id;

          if (!publicId) {
            const urlParts = avatarUrl.split("/");
            const uploadIndex = urlParts.findIndex((part) => part === "upload");
            if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
              const pathAfterUpload = urlParts.slice(uploadIndex + 2).join("/");
              publicId = pathAfterUpload.replace(/\.[^/.]+$/, "");
            }
          }

          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (cloudinaryError) {
          console.error(
            "❌ Error deleting old avatar from Cloudinary:",
            cloudinaryError
          );
        }
      }
    }

    let uploadResult;
    try {
      uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_profiles",
        public_id: `user_${userId}_${Date.now()}`,
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto" },
          { format: "webp" },
        ],
        timeout: 60000,
      });
    } catch (cloudinaryError) {
      console.error("❌ Cloudinary upload failed:", cloudinaryError);

      return res.status(500).json({
        message: "Failed to upload image to Cloudinary",
        error:
          cloudinaryError instanceof Error
            ? cloudinaryError.message
            : "Unknown error",
      });
    }

    const updateData = {
      "profile.avatar": uploadResult.secure_url,
      "profile.public_id": uploadResult.public_id,
      "profile.updatedAt": new Date(),
    };

    let updatedUser;
    try {
      updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    } catch (dbError) {
      console.error("❌ Database update failed:", dbError);

      return res.status(500).json({
        message: "Failed to update user in database",
        error: dbError instanceof Error ? dbError.message : "Unknown error",
      });
    }

    if (!updatedUser) {
      console.error("❌ No user returned from database update");
      return res.status(500).json({
        message: "Failed to update user in database - no user returned",
      });
    }

    res.status(200).json({
      message: "Profile image uploaded successfully",
      data: {
        avatar: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        user: updatedUser,
      },
    });
  } catch (error: any) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      message: "Failed to upload image",
      error: error.message,
    });
  }
};

export const deleteProfileImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const currentUser = await getOne(userId);
    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const defaultAvatarUrl =
      "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png";

    if (
      currentUser.profile?.avatar &&
      currentUser.profile.avatar !== defaultAvatarUrl
    ) {
      const avatarUrl = currentUser.profile.avatar;
      if (avatarUrl.includes("cloudinary.com")) {
        try {
          let publicId = currentUser.profile?.public_id;

          if (!publicId) {
            const urlParts = avatarUrl.split("/");
            const uploadIndex = urlParts.findIndex((part) => part === "upload");
            if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
              const pathAfterUpload = urlParts.slice(uploadIndex + 2).join("/");
              publicId = pathAfterUpload.replace(/\.[^/.]+$/, "");
            }
          }

          if (publicId) {
            const deleteResult = await cloudinary.uploader.destroy(publicId);
          }
        } catch (cloudinaryError) {
          console.error("❌ Error deleting from Cloudinary:", cloudinaryError);
        }
      }
    }

    const response = await updateUser(userId, {
      profile: {
        ...currentUser.profile,
        avatar: defaultAvatarUrl,
        public_id: undefined,
        updatedAt: new Date(),
      },
    });

    if (!response.success) {
      return res.status(500).json({
        message: response.message,
      });
    }

    res.status(200).json({
      message: "Profile image deleted successfully",
      data: {
        avatar: defaultAvatarUrl,
        user: response.data,
      },
    });
  } catch (error: any) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      message: "Failed to delete image",
      error: error.message,
    });
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const user = await getOneWithConnections(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const currentUser = await getOne(userId);
    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const defaultAvatarUrl =
      "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png";

    if (
      currentUser.profile?.avatar &&
      currentUser.profile.avatar !== defaultAvatarUrl
    ) {
      const avatarUrl = currentUser.profile.avatar;
      if (avatarUrl.includes("cloudinary.com")) {
        try {
          const urlParts = avatarUrl.split("/");
          const fileWithExtension = urlParts[urlParts.length - 1];
          const publicId = `user_profiles/${fileWithExtension.split(".")[0]}`;

          await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryError) {
          console.error(
            "Error deleting avatar from Cloudinary:",
            cloudinaryError
          );
        }
      }
    }

    const response = await deleteUserService(userId);

    if (!response) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!response.success) {
      return res.status(500).json({
        message: response.message,
      });
    }

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting account:", error);
    res.status(500).json({
      message: "Failed to delete account",
      error: error.message,
    });
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    const user = await getOneWithPassword(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.provider !== "local") {
      return res.status(400).json({
        message: "Password change not available for social login accounts",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "No password found for this account",
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    const response = await updateUser(userId, {
      password: hashedNewPassword,
    });

    if (!response.success) {
      return res.status(500).json({
        message: response.message,
      });
    }

    const updatedUser = await getOneWithPassword(userId);

    if (updatedUser && updatedUser.password) {
      await bcrypt.compare(newPassword, updatedUser.password);

      await bcrypt.compare(currentPassword, updatedUser.password);
    }

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const addUserConnection = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const { connectionId } = req.body;

    if (!connectionId) {
      return res.status(400).json({
        message: "Connection ID is required",
      });
    }

    if (userId === connectionId) {
      return res.status(400).json({
        message: "Cannot connect to yourself",
      });
    }

    const result = await addConnection(userId, connectionId);

    if (!result.success) {
      return res.status(500).json({
        message: result.message,
      });
    }

    res.status(200).json({
      message: result.message,
      type: result.type,
    });
  } catch (error) {
    next(error);
  }
};

export const removeUserConnection = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const { connectionId } = req.params;

    const result = await removeConnection(userId, connectionId);

    if (!result.success) {
      return res.status(500).json({
        message: result.message,
      });
    }

    res.status(200).json({
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailableUsersToConnect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;

    const result = await getAvailableUsers(userId);

    if (!result.success) {
      return res.status(500).json({
        message: result.message,
      });
    }

    res.status(200).json({
      message: "Available users retrieved successfully",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const payload = req.body;

    const result = await updateUser(userId, payload);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error",
    });
  }
};

export const getPendingConnectionRequests = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId)
      .populate("connectionsRequests")
      .exec();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user.connectionsRequests,
    });
  } catch (error) {
    next(error);
  }
};

export const acceptConnection = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const { requesterId } = req.body;

    if (!requesterId) {
      return res.status(400).json({
        message: "Requester ID is required",
      });
    }

    const result = await acceptConnectionRequest(userId, requesterId);

    if (!result.success) {
      return res.status(500).json({
        message: result.message,
      });
    }

    res.status(200).json({
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectConnection = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const { requesterId } = req.body;

    if (!requesterId) {
      return res.status(400).json({
        message: "Requester ID is required",
      });
    }

    const result = await rejectConnectionRequest(userId, requesterId);

    if (!result.success) {
      return res.status(500).json({
        message: result.message,
      });
    }

    res.status(200).json({
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
