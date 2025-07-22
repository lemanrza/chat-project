import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import userRouter from "./routes/userRoute.js";
import { errorHandler } from "./errors/errorHandler.js";
import githubRouter from "./routes/githubRoute.js";
import googleRouter from "./routes/googleRoute.js";
import passport from "passport";
import "./config/passport.js";
import "./config/passportLogin.js";

const app = express();

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});

// Global middlewares
app.use(express.json());
app.use(limiter);
app.use(cors());

//routes
app.use(passport.initialize());
app.use("/auth", googleRouter);
app.use("/auth", githubRouter);
app.use("/auth", userRouter);

app.use(errorHandler);

app.get("/", (_, res) => {
  res.send("Server is up and running!");
});

export default app;
