import mongoose from "mongoose";
const profileSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    displayName: {
        type: String,
        default: function () {
            if (this.firstName && this.lastName) {
                return `${this.firstName} ${this.lastName}`;
            }
            return undefined;
        },
    },
    avatar: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png",
    },
    public_id: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "Welcome to my profile! I'm just getting started here and looking forward to meeting new people, learning new things, and sharing great conversations. Stay tuned as I update more about myself!",
    },
    location: { type: String, default: "" },
    dateOfBirth: { type: Date, default: null },
});
export default profileSchema;
