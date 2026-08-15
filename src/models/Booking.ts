import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
  userId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  children: number;          // 🆕 children count
  totalPrice: number;
  specialRequests?: string;  // 🆕 optional text
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  userId: { type: String, required: true },
  roomId: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true, min: 1 },
  children: { type: Number, default: 0, min: 0 },        // added
  totalPrice: { type: Number, required: true },
  specialRequests: { type: String, default: "" },        // added
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
}, { timestamps: true });

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;