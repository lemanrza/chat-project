import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },

    seenBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        seenAt: { type: Date, default: Date.now },
      },
    ],

    type: {
      type: String,
      enum: ["text", "image", "file", "audio", "video", "system"],
      default: "text",
    },

    attachments: [
      {
        type: { type: String, enum: ["image", "file", "audio", "video"] },
        url: String,
        filename: String,
        size: Number,
        mimetype: String,
      },
    ],

    status: {
      type: String,
      enum: ["sent", "delivered", "read", "failed"],
      default: "sent",
    },

    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        emoji: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    edited: {
      isEdited: { type: Boolean, default: false },
      editedAt: { type: Date },
      originalContent: { type: String },
    },

    deleted: {
      isDeleted: { type: Boolean, default: false },
      deletedAt: { type: Date },
      deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  },
  { timestamps: true }
);

// ✅ NEW: Indexes for performance
messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ "seenBy.user": 1 });
messageSchema.index({ status: 1 });
messageSchema.index({ "deleted.isDeleted": 1 });

export default messageSchema;
