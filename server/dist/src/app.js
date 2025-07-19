import express from "express";
import rateLimit from "express-rate-limit";
import userRouter from "./routes/userRoute.js";
import { errorHandler } from "./errors/errorHandler.js";
const app = express();
// Rate limiter middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
});
// Global middlewares
app.use(express.json());
app.use(limiter);
//routes
app.use("/auth", userRouter);
app.use(errorHandler);
app.get("/", (_, res) => {
    res.send("Server is up and running!");
});
export default app;
