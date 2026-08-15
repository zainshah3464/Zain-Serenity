import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import nodemailer from "nodemailer";
import { welcomeNewAccountEmail, welcomeBackEmail } from "@/lib/emailTemplates";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password");
        }
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("Invalid email or password");

        if (!user.isVerified) {
          throw new Error("Please verify your email address before logging in.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash || ""
        );
        if (!isPasswordValid) throw new Error("Invalid email or password");

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      await dbConnect();

      // Google specific: create user if not exists
      if (account?.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            name: user.name || "Google User",
            email: user.email || "",
            role: "customer",
            isVerified: true,
          });
        }
        const dbUser = existingUser || (await User.findOne({ email: user.email }));
        if (dbUser) {
          user.id = dbUser._id.toString();
          user.role = dbUser.role;
        }
      }

      // ✅ Send login notification email (non‑blocking) & update lastLogin
      const dbUser = await User.findOne({ email: user.email });
      if (dbUser) {
        const isFirstLogin = !dbUser.lastLogin;
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/my-bookings`;

        // Fire email asynchronously so login doesn't wait
        if (isFirstLogin) {
          transporter.sendMail({
            from: `"Zain's Serenity" <${process.env.EMAIL_USER}>`,
            to: dbUser.email,
            subject: "Welcome to Zain's Serenity!",
            html: welcomeNewAccountEmail(dbUser.name, loginUrl),
          }).catch(err => console.error("Welcome email failed:", err));
        } else {
          transporter.sendMail({
            from: `"Zain's Serenity" <${process.env.EMAIL_USER}>`,
            to: dbUser.email,
            subject: "Welcome Back to Zain's Serenity",
            html: welcomeBackEmail(dbUser.name, loginUrl),
          }).catch(err => console.error("Welcome back email failed:", err));
        }

        // Update lastLogin
        dbUser.lastLogin = new Date();
        await dbUser.save();
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET as string,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };