import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { rateLimit } from "@/lib/rateLimiter";
import { getEmailWrapper, styledButton, styledDivider } from "@/lib/emailTemplates";

export async function POST(req: Request) {
  // Rate limiting based on IP
  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const { ok, remaining } = rateLimit(`register-${ip}`, 5, 60_000);
  if (!ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again after a minute." },
      { status: 429 }
    );
  }

  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  // Password strength check
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    return NextResponse.json(
      { error: "Password must contain uppercase, lowercase, and a number" },
      { status: 400 }
    );
  }

  await dbConnect();
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const verificationToken = crypto.randomBytes(32).toString("hex");

  // Save user with token and expiry (1 hour)
  await User.create({
    name,
    email,
    passwordHash,
    role: "customer",
    verificationToken,
    verificationTokenExpiry: Date.now() + 3600_000,
    isVerified: false,
  });

  // Send verification email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${verificationToken}&email=${email}`;

  await transporter.sendMail({
    from: `"Zain's Serenity" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email address",
    html: getEmailWrapper(
      "Welcome to Zain's Serenity!",
      `
        <p>Hi ${name},</p>
        <p>Thank you for joining our mountain retreat. To complete your registration and start exploring, please verify your email address by clicking the button below.</p>
        <p style="font-size:15px; color:#64748b;">This link will expire in <strong>1 hour</strong>.</p>
        ${styledButton(verifyUrl, "Verify Your Email")}
        ${styledDivider()}
        <p style="font-size:14px; color:#64748b;">If the button doesn't work, you can also use this link:<br><a href="${verifyUrl}" style="color:#0d9488; text-decoration:underline; word-break:break-all;">${verifyUrl}</a></p>
      `
    ),
  });

  return NextResponse.json({ success: true, message: "Registration successful. Check your email." });
}