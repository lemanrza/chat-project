import mongoose from "mongoose";
import profileSchema from "./profileSchema";
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: function () {
            return this.provider === "local";
        },
    },
    profile: profileSchema,
    provider: {
        type: String,
        enum: ["local", "google", "github"],
        default: "local",
    },
    providerId: {
        type: String,
        default: null,
    },
    lastLogin: { type: Date, default: null },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    lastSeen: { type: Boolean, default: null },
    isOnline: { type: Boolean, default: false },
    emailVerified: {
        type: Boolean,
        default: function () {
            return this.provider !== "local";
        },
    },
}, { timestamps: true, versionKey: false });
export default userSchema;
