import { createUser, getUserByEmail } from "../db/users";
import { Request, Response } from "express";
import { authentication, random } from "../helpers";

const jwt = require("jsonwebtoken");

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmpassword, username, tel, about, company } =
      req.body;
    if (!email || !password || !username) {
      return res.status(400);
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        message: "This user all ready!",
      });
    }
    if (password === confirmpassword) {
      const salt = random();
      const user = await createUser({
        email,
        username,
        // image: req.file.path,
        tel,
        about,
        company,
        authentication: {
          salt,
          password: authentication(salt, password),
        },
      });
      return res.status(200).json(user);
    } else {
      return res.status(400).json({
        message: "Passwrod unequal Confirm password!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400);
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.status(400).json({
        message: "Not found user!",
      });
    }

    const passwordHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== passwordHash) {
      return res.status(403).json({
        message: "Wrong password!",
      });
    }

    const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "20m",
    });

    return res.status(200).json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};
