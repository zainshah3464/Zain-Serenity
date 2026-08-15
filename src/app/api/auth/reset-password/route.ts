import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, token, newPassword } = await req.json();
  if (!email || !token || !newPassword) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  if (newPassword.length < 6 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
    return NextResponse.json({ error: "Password must contain uppercase, lowercase, and a number, min 6 chars" }, { status: 400 });
  }

  await dbConnect();
  const user = await User.findOne({ email, resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
  if (!user) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  return NextResponse.json({ success: true, message: "Password reset successful. Please login." });
}