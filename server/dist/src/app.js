import express from "express";
import rateLimit from "express-rate-limit";
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
// Routes
app.get("/", (_, res) => {
    res.send("Server is up and running! update");
});
export default app;
