import dotenv from "dotenv";
import { createServer } from "http";
import connectToDB from "./config/db.js";
import app from "./app.js";
import { initializeSocket } from "./socket/socketServer.js";
import config from "./config/config.js";
dotenv.config();
console.log("🚀 Starting server...");
const httpServer = createServer(app);
console.log("️ Connecting to database...");
const startServer = async () => {
    try {
        await connectToDB();
        console.log("🔌 Initializing Socket.io...");
        const io = await initializeSocket(httpServer);
        global.io = io;
        httpServer.listen(config.PORT, () => {
            console.log(`✅ Server running on http://localhost:${config.PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
