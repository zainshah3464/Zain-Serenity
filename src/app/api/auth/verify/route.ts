import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { encode } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) {
    return NextResponse.redirect(new URL("/login?error=missing_token", req.url));
  }

  await dbConnect();
  const user = await User.findOne({ email, verificationToken: token });
  if (!user) {
    return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
  }

  // Check expiry
  if (user.verificationTokenExpiry && user.verificationTokenExpiry < Date.now()) {
    return NextResponse.redirect(new URL("/login?error=expired_token", req.url));
  }

  // Mark verified
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  await user.save();

  // Auto‑login: create a JWT session token
  const sessionToken = await encode({
    token: {
      id: user._id.toString(),
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    secret: process.env.NEXTAUTH_SECRET as string,
  });

  const cookieStore = await cookies();
  cookieStore.set("next-auth.session-token", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  const redirectUrl = user.role === "admin" ? "/admin" : "/";
  return NextResponse.redirect(new URL(redirectUrl, req.url));
}