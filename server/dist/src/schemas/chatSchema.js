import mongoose from "mongoose";
const chatSchema = new mongoose.Schema({
    members: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null,
    },
}, { timestamps: true });
export default chatSchema;
