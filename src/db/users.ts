import mongoose from "mongoose";

interface Authentication {
  salt: string;
  password: string;
}

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, require: true },
  tel: { type: Number, require: false },
  company: { type: String, require: false },
  about: { type: String, require: false },
  image: { type: String, require: false },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});

export const UserModel = mongoose.model("User", UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({
    "authentication.sessionToken": sessionToken,
  });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, Authentication | string>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const deleteUser = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (
  id: string,
  values: Record<string, Authentication | string>
) => UserModel.findByIdAndUpdate(id, values);
