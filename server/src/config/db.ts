import mongoose from "mongoose";
import config from "./config.js";

const connectToDB = (httpServer: any) => {
  if (!config.DB_URL) {
    console.log("❌ DB_URL is not defined in environment variables");
    process.exit(1);
  }

  mongoose
    .connect(config.DB_URL)
    .then(() => {
      console.log("🚀 mongodb connected successfully");
      httpServer.listen(config.PORT, () => {
        console.log(`✅ Server running on http://localhost:${config.PORT}`);
      });
    })
    .catch((error) => {
      console.log("❌ mongodb connection failed", error);
    });
};

export default connectToDB;
