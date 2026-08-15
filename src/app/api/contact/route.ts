import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getEmailWrapper, styledButton, styledDivider } from "@/lib/emailTemplates";

export async function POST(request: Request) {
  const { name, email, message } = await request.json();

  // Basic validation
  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Guesthouse Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // admin email
      subject: `New Enquiry from ${name}`,
      html: getEmailWrapper(
        "New Contact Form Submission",
        `
          <table cellpadding="0" cellspacing="0" style="width:100%; border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0; font-weight:600; color:#1f2937; width:80px;">Name</td>
              <td style="color:#4b5563;">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0; font-weight:600; color:#1f2937;">Email</td>
              <td style="color:#4b5563;"><a href="mailto:${email}" style="color:#0d9488;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:10px 0; font-weight:600; color:#1f2937; vertical-align:top;">Message</td>
              <td style="color:#4b5563; padding:10px 0;">${message.replace(/\n/g, '<br>')}</td>
            </tr>
          </table>
          ${styledDivider()}
          <p style="font-size:15px; color:#475569; margin-bottom:20px;">You can reply directly by clicking the button below.</p>
          ${styledButton(`mailto:${email}`, `Reply to ${name}`)}
        `
      ),
    });

    return NextResponse.json(
      { success: "Message sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}