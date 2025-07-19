import express from "express";
import rateLimit from "express-rate-limit";
import userRouter from "./routes/userRoute";

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

// Routes
app.get("/", (_, res) => {
  res.send("Server is up and running! update");
});

export default app;
