import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import nodemailer from "nodemailer";
import { getEmailWrapper, styledButton, styledDivider } from "@/lib/emailTemplates";

// ---------- Refined Professional Badge System ----------
const AMENITY_BADGES: Record<string, string> = {
  wifi: "WiFi",
  tv: "TV",
  "air conditioning": "AC",
  "mountain view": "MV",
  balcony: "Balc",
  bathtub: "Bath",
  "coffee maker": "Cof",
  default: "✔",
};

function getAmenityBadge(amenity: string): string {
  const key = amenity.toLowerCase().trim();
  const abbr = AMENITY_BADGES[key] || AMENITY_BADGES.default;
  // Modern chip-style badge – light teal background, dark teal text, subtle border
  return `
    <span style="
      display:inline-block;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
      background-color:#f0fdfa;
      color:#0f766e;
      border:1px solid #99f6e4;
      border-radius:6px;
      padding:3px 8px;
      font-size:12px;
      font-weight:600;
      letter-spacing:0.03em;
      vertical-align:middle;
      margin-right:6px;
      line-height:1.4;
    ">${abbr}</span>
  `.replace(/\s+/g, " ").trim(); // keep inline clean
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await req.json();

  if (!status || !["confirmed", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  await dbConnect();

  const currentBooking = await Booking.findById(id);
  if (!currentBooking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  if (currentBooking.status !== "pending") {
    return NextResponse.json(
      { error: "Booking is already finalized." },
      { status: 400 }
    );
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!updatedBooking) {
    return NextResponse.json({ error: "Booking not found after update." }, { status: 404 });
  }

  // Send email notification
  try {
    const [room, user] = await Promise.all([
      Room.findById(updatedBooking.roomId)
        .select("name amenities images")
        .lean(),
      User.findById(updatedBooking.userId).select("email name").lean(),
    ]);

    if (user?.email) {
      const roomName = room?.name || "Your Room";
      const checkIn = new Date(updatedBooking.checkIn).toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      });
      const checkOut = new Date(updatedBooking.checkOut).toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      });
      const price = updatedBooking.totalPrice;
      const mainPhoto = room?.images?.[0] || null;
      const amenities: string[] = room?.amenities || [];

      // --- Build amenities HTML (polished badges + text) ---
      let amenitiesHtml = "";
      if (amenities.length > 0) {
        const items = amenities
          .map((a) => {
            const badge = getAmenityBadge(a);
            return `<span style="display:inline-block; margin-right:14px; margin-bottom:10px; white-space:nowrap; vertical-align:middle;">
              ${badge}
              <span style="font-size:14px; color:#374151; vertical-align:middle; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">${a}</span>
            </span>`;
          })
          .join("");
        amenitiesHtml = `
          <div style="margin-top:24px;">
            <p style="font-size:15px; font-weight:600; color:#1f2937; margin-bottom:10px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Amenities</p>
            <div style="line-height:1.8; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">${items}</div>
          </div>
        `;
      }

      // --- Build photo HTML ---
      const photoHtml = mainPhoto
        ? `<img src="${mainPhoto}" alt="${roomName}" style="width:100%; max-width:200px; height:auto; border-radius:12px; margin-bottom:16px; display:block;" />`
        : "";

      let subject: string;
      let title: string;
      let message: string;
      let actionHtml: string;

      if (status === "confirmed") {
        subject = "Booking Confirmed – Zain's Serenity";
        title = "Your Booking is Confirmed!";
        message = `
          <p style="font-size:15px; color:#374151; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Dear ${user.name || "Guest"},</p>
          <p style="font-size:15px; color:#374151; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Great news! Your stay at <strong>Zain's Serenity</strong> has been confirmed.</p>
          ${photoHtml}
          <p style="font-size:15px; color:#374151; margin-top:16px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;"><strong>Booking Summary:</strong></p>
          <table cellpadding="0" cellspacing="0" style="width:100%; margin:12px 0; border-collapse:collapse; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
            <tr>
              <td style="padding:8px 0; font-weight:600; color:#1f2937; width:40%;">Room</td>
              <td style="color:#4b5563;">${roomName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; font-weight:600; color:#1f2937;">Check-in</td>
              <td style="color:#4b5563;">${checkIn}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; font-weight:600; color:#1f2937;">Check-out</td>
              <td style="color:#4b5563;">${checkOut}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; font-weight:600; color:#1f2937;">Guests</td>
              <td style="color:#4b5563;">${updatedBooking.guests} Adults${updatedBooking.children ? `, ${updatedBooking.children} Children` : ""}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; font-weight:600; color:#1f2937;">Total</td>
              <td style="color:#0d9488; font-weight:700; font-size:16px;">$${price}</td>
            </tr>
          </table>
          ${amenitiesHtml}
          <p style="font-size:15px; color:#374151; margin-top:20px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">We look forward to welcoming you for a wonderful stay at Zain's Serenity.</p>
        `;
        actionHtml = styledButton(`${process.env.NEXT_PUBLIC_BASE_URL}/my-bookings`, "View My Bookings");
      } else {
        subject = "Booking Cancelled – Zain's Serenity";
        title = "Booking Cancellation";
        message = `
          <p style="font-size:15px; color:#374151; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Dear ${user.name || "Guest"},</p>
          <p style="font-size:15px; color:#374151; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">We're sorry to inform you that your booking at <strong>Zain's Serenity</strong> has been cancelled.</p>
          <table cellpadding="0" cellspacing="0" style="width:100%; margin:12px 0; border-collapse:collapse; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
            <tr>
              <td style="padding:8px 0; font-weight:600; color:#1f2937; width:40%;">Room</td>
              <td style="color:#4b5563;">${roomName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; font-weight:600; color:#1f2937;">Check-in</td>
              <td style="color:#4b5563;">${checkIn}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; font-weight:600; color:#1f2937;">Check-out</td>
              <td style="color:#4b5563;">${checkOut}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; font-weight:600; color:#1f2937;">Total</td>
              <td style="color:#0d9488; font-weight:700; font-size:16px;">$${price}</td>
            </tr>
          </table>
          <p style="font-size:15px; color:#374151; margin-top:16px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">If you have any questions or would like to rebook, please feel free to contact us.</p>
        `;
        actionHtml = styledButton(`${process.env.NEXT_PUBLIC_BASE_URL}/rooms`, "Browse Rooms");
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Zain's Serenity" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject,
        html: getEmailWrapper(title, `${message}${styledDivider()}${actionHtml}`),
      });
    }
  } catch (emailError) {
    console.error("Failed to send booking status email:", emailError);
  }

  return NextResponse.json(updatedBooking);
}