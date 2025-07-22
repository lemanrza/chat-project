import { NextFunction, Request, Response } from "express";
import {
  getAll,
  getByEmail,
  getOne,
  login,
  register,
  resetPass,
  unlockAcc,
  forgotPassword as forgotPasswordService,
  deleteUser as deleteUserService,
  updateUser,
} from "../services/userService.js";
import formatMongoData from "../utils/formatMongoData.js";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/jwt.js";
import { sendVerificationEmail } from "../utils/sendMail.js";
import cloudinary from "../config/cloudinaryConfig.js";
import config from "../config/config.js";
import multer from "multer";
import path from "path";

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

interface AuthenticatedRequest extends Request {
  user?: any;
}

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

interface AuthenticatedRequest extends Request {
  user?: any;
}

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

interface AuthenticatedMulterRequest extends AuthenticatedRequest {
  file?: Express.Multer.File;
}
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
    const { password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_profiles",
      });

      req.body.profile = uploadedImage.secure_url;
      req.body.public_id = uploadedImage.public_id;
    }

    const response: any = await register({
      ...req.body,
      password: hashedPassword,
    });

    if (!response.success) {
      throw new Error(response.message);
    }

    // Send email service ...
    const token = generateAccessToken(
      {
        id: response.data._id,
        email: req.body.email,
        fullName: req.body.profile.displayName,
      },
      "6h"
    );

    const verificationLink = `${process.env.SERVER_URL}/auth/verify-email?token=${token}`;
    sendVerificationEmail(
      req.body.email,
      req.body.profile.displayName,
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

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id; // Get user ID from JWT token
    const updateData = req.body;

    const response = await updateUser(userId, updateData);

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

// Upload profile image to Cloudinary
export const uploadProfileImage = async (
  req: AuthenticatedMulterRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    console.log("Upload request from user:", userId);

    if (!req.file) {
      console.log("No file provided");
      return res.status(400).json({
        message: "No image file provided",
      });
    }

    console.log("File details:", {
      size: req.file.size,
      mimetype: req.file.mimetype,
      originalname: req.file.originalname,
      path: req.file.path,
    });

    console.log("Uploading to Cloudinary...");
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "user_profiles",
      public_id: `user_${userId}_${Date.now()}`,
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
        { quality: "auto" },
      ],
    });

    console.log("Cloudinary upload successful:", uploadResult.secure_url);

    // Clean up the uploaded file from local storage
    const fs = await import("fs");
    try {
      fs.unlinkSync(req.file.path);
    } catch (err) {
      console.log("File cleanup failed:", err);
    }

    // Update only the avatar field in the user's profile
    const response = await updateUser(userId, {
      $set: {
        "profile.avatar": uploadResult.secure_url,
      },
    });

    if (!response.success) {
      return res.status(500).json({
        message: response.message,
      });
    }

    res.status(200).json({
      message: "Profile image uploaded successfully",
      data: {
        avatar: uploadResult.secure_url,
        user: response.data,
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

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const user = await getOne(userId);

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

export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    // Get user to verify current password
    const user = await getOne(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if user is local provider (has password)
    if (user.provider !== "local") {
      return res.status(400).json({
        message: "Password change not available for social login accounts",
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password || ""
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    const response = await updateUser(userId, {
      $set: {
        password: hashedNewPassword,
      },
    });

    if (!response.success) {
      return res.status(500).json({
        message: response.message,
      });
    }

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};
