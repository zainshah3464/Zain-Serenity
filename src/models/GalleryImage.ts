import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGalleryImage extends Document {
  url: string;
  caption?: string;
  category: "featured" | "rooms" | "bathroom" | "exterior" | "amenities" | "pool" | "other";
  uploadedBy: string;
  createdAt: Date;
}

const GalleryImageSchema = new Schema<IGalleryImage>(
  {
    url: { type: String, required: true },
    caption: { type: String },
    category: {
      type: String,
      enum: ["featured", "rooms", "bathroom", "exterior", "amenities", "pool", "other"],
      default: "other",
    },
    uploadedBy: { type: String, required: true },
  },
  { timestamps: true }
);

const GalleryImage: Model<IGalleryImage> =
  mongoose.models.GalleryImage || mongoose.model<IGalleryImage>("GalleryImage", GalleryImageSchema);

export default GalleryImage;