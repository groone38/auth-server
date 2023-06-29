import { getUserById, updateUserById } from "../db/users";
import { Request, Response } from "express";

interface IUser {
  _id: string;
  iat: number;
}

export interface IGetUserAuthInfoRequest extends Request {
  user: IUser;
}
export const getUser = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const user = await getUserById(req.user._id);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({
      message: "User not Found!",
    });
  }
};

export const updateUser = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  const { email, username, tel, about, company } = req.body;
  const user = await getUserById(req.user._id);
  if (user) {
    if (req.file) {
      await updateUserById(req.user._id, {
        email,
        username,
        tel,
        company,
        about,
        image: req.file.path,
      });
      return res.status(200).json({
        message: "Update profile succsess!",
      });
    } else {
      await updateUserById(req.user._id, {
        email,
        username,
        tel,
        company,
        about,
      });
      return res.status(200).json({
        message: "Update profile succsess!",
      });
    }
  }

  res.status(404).json({
    message: "User not found!",
  });
};
