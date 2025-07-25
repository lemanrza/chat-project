import mongoose from "mongoose";
const chatSchema = new mongoose.Schema({
    members: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            role: {
                type: String,
                enum: ["admin", "moderator", "member"],
                default: "member",
            },
            joinedAt: { type: Date, default: Date.now },
            leftAt: { type: Date, default: null },
            isActive: { type: Boolean, default: true },
        },
    ],
    type: {
        type: String,
        enum: ["direct", "group", "channel"],
        default: "direct",
    },
    name: {
        type: String,
        required: function () {
            return this.type !== "direct";
        },
    },
    description: { type: String },
    avatar: { type: String },
    lastMessage: {
        message: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
        timestamp: { type: Date },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        preview: { type: String },
    },
    settings: {
        isPrivate: { type: Boolean, default: false },
        allowInvites: { type: Boolean, default: true },
        muteNotifications: { type: Boolean, default: false },
        autoDeleteMessages: {
            enabled: { type: Boolean, default: false },
            duration: { type: Number },
        },
    },
    messageCount: { type: Number, default: 0 },
    currentlyTyping: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            startedAt: { type: Date, default: Date.now },
        },
    ],
    pinnedMessages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
    ],
    archived: {
        isArchived: { type: Boolean, default: false },
        archivedAt: { type: Date },
        archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
export default chatSchema;
