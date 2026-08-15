import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string; // 👈 ab optional hai (Google users ke liye)
  role: "admin" | "customer";
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: number;   // milliseconds timestamp
  resetToken?: string;                // ✅ new
  resetTokenExpiry?: number;          // ✅ new
  lastLogin?: Date;                   // ✅ added
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: false }, // 👈 required false
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Number },
    resetToken: { type: String },               // ✅ new
    resetTokenExpiry: { type: Number },         // ✅ new
    lastLogin: { type: Date },                  // ✅ added
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;