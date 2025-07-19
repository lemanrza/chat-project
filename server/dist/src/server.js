import dotenv from "dotenv";
import connectToDB from "./config/db.js";
import app from "./app.js";
dotenv.config();
connectToDB(app);
