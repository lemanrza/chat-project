import mongoose from "mongoose";
import config from "./config.js";
const connectToDB = (app) => {
    if (config.DB_URL) {
        mongoose
            .connect(config.DB_URL)
            .then(() => {
            console.log("🚀 mongodb connected successfully");
            app.listen(config.PORT, () => {
                console.log(`✅ Server running on http://localhost:${config.PORT}`);
            });
        })
            .catch(() => {
            console.warn("❌ db connection failed");
        });
    }
};
export default connectToDB;
