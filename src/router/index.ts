import { Request, Router } from "express";
import { login, register } from "../controllers/authentication";
import { authenticateJWT } from "../helpers";
import { getUser, onDeleteUser, updateUser } from "../controllers/user";
import multer from "multer";
import fs from "fs";

export const authRouter = Router();
export const userRouter = Router();
// export const storage = multer.diskStorage({
//   destination(
//     req: Request,
//     file: Express.Multer.File,
//     cb: (error: Error | null, destination: string) => void
//   ) {
//     if (fs.existsSync("image")) {
//       fs.mkdirSync("image");
//     }
//     cb(null, "image");
//   },
//   filename: (
//     req: Request,
//     file: Express.Multer.File,
//     cb: (error: Error | null, destination: string) => void
//   ) => {
//     cb(null, new Date().getMilliseconds() + "-" + file.originalname);
//   },
// });
// export const upload = multer({ storage });
authRouter.post("/register", register);
authRouter.post("/login", login);
userRouter.get("/", authenticateJWT, getUser);
userRouter.put("/", authenticateJWT, updateUser);
userRouter.delete("/", authenticateJWT, onDeleteUser);
