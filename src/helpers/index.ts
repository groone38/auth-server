import crypto from "crypto";
import { NextFunction, Request, Response } from "express";

const jwt = require("jsonwebtoken");

export interface IGetUserAuthInfoRequest extends Request {
  user: IUser;
}

interface IUser {
  user: {
    _id: string;
    iat: number;
  };
}

export const random = () => crypto.randomBytes(128).toString("base64");
export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(process.env.JWT_SECRET)
    .digest("hex");
};

export const authenticateJWT = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    // const token = authHeader;

    jwt.verify(token, process.env.JWT_SECRET, (err: Error, user: IUser) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;

      next();
    });
  } else {
    res.sendStatus(401);
  }
};
