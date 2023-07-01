import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import { authRouter, userRouter } from "./router/index";

require("dotenv").config();
const app = express();

app.use(
  cors({
    origin: ["https://auth-server-livid.vercel.app"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/image", express.static("image"));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("Server running on http//localhost:8080/");
});

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/auth", authRouter);
app.use("/user", userRouter);
