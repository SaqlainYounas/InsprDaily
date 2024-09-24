import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import {
  addEmailController,
  removeEmailController,
} from "./controllers/emailController";
import { scheduleDailyQuotes } from "./jobs/dailyEmail";
const corsOptions = {
  origin: process.env.FRONTEND_HOST,
  credentials: true,
  optionsSuccessStatus: 200,
};

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(cors(corsOptions));

/* ROUTES */
app.post("/addEmail", addEmailController);
app.post("/unsubscribe", removeEmailController);

/* SERVER */
const port = Number(process.env.port) || 80;
console.log("PORT", port);
app.listen(port, "0.0.0.0", () => {
  console.log("Server running on port ", port);
  scheduleDailyQuotes();
});
