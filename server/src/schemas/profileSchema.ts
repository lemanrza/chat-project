import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  fullName: String,
  lastName: String,
  displayName: String,
  avatar: String,
  bio: String,
  location: String,
  dateOfBirth: String,
});

export default profileSchema;
