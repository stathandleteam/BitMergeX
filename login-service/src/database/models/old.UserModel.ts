import { model, Schema } from "mongoose";

interface IUserModel extends Document {
    username: string;
    email: string;
    password: string;
}

const UserSchema = new Schema<IUserModel>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
  
export const UserModel = model<IUserModel>('User', UserSchema);