import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRoom extends Document {
  name: string;
  description: string;
  price: number;
  image: string;           // main image
  images: string[];        // multiple images
  capacity: number;
  amenities: string[];
  status: "active" | "inactive" | "maintenance";
  isFeatured: boolean;
  isNewRoom: boolean;      // ✅ renamed from isNew
  view?: string;           // ✅ new field (e.g. "Mountain view")
  rating: number;
  roomType: string;
  bedType: string;
  size: string;            // e.g., "350 sq ft"
  discount?: number;       // optional percentage
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    images: [{ type: String }],
    capacity: { type: Number, default: 2 },
    amenities: [{ type: String }],
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active",
    },
    isFeatured: { type: Boolean, default: false },
    isNewRoom: { type: Boolean, default: true },   // ✅ renamed
    view: { type: String, default: "" },           // ✅ new
    rating: { type: Number, default: 0, min: 0, max: 5 },
    roomType: { type: String, default: "standard" },
    bedType: { type: String, default: "queen" },
    size: { type: String, default: "" },
    discount: { type: Number, default: 0 },
  },
  { timestamps: true }   // automatically manages createdAt / updatedAt
);

const Room: Model<IRoom> =
  mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema);

export default Room;