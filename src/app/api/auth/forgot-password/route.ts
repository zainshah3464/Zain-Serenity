import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { rateLimit } from "@/lib/rateLimiter";
import { getEmailWrapper, styledButton } from "@/lib/emailTemplates";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const { ok } = rateLimit(`forgot-${ip}`, 3, 60_000);
  if (!ok) return NextResponse.json({ error: "Too many attempts." }, { status: 429 });

  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  await dbConnect();
  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal whether the email exists
    return NextResponse.json({
      success: true,
      message: "If email exists, a reset link has been sent.",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = Date.now() + 3600_000; // 1 hour
  user.resetToken = resetToken;
  user.resetTokenExpiry = resetTokenExpiry;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

  await transporter.sendMail({
    from: `"Zain's Serenity" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request",
    html: getEmailWrapper(
      "Reset Your Password",
      `
        <p>We received a request to reset the password for your account. If you made this request, click the button below to choose a new password. The link is valid for <strong>1 hour</strong>.</p>
        ${styledButton(resetUrl, "Reset Password")}
        <p style="font-size:15px; color:#64748b; margin-top:16px;">If you didn't request a password reset, you can safely ignore this email. Your account remains secure.</p>
        <hr style="border:0; border-top:1px solid #e2e8f0; margin:28px 0 20px;" />
        <p style="font-size:14px; color:#64748b;">Button not working? Copy and paste this link into your browser:<br><a href="${resetUrl}" style="color:#0d9488; text-decoration:underline; word-break:break-all;">${resetUrl}</a></p>
      `
    ),
  });

  return NextResponse.json({
    success: true,
    message: "If email exists, a reset link has been sent.",
  });
}