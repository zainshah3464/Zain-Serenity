import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import GalleryImage, { IGalleryImage } from "@/models/GalleryImage";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_CATEGORIES: IGalleryImage["category"][] = [
  "featured", "rooms", "bathroom", "exterior", "amenities", "pool", "other",
];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const images = await GalleryImage.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json(images);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const caption = (formData.get("caption") as string) || "";
  let category = (formData.get("category") as string) || "other";

  // Validate and cast category
  if (!ALLOWED_CATEGORIES.includes(category as any)) {
    category = "other";
  }
  const finalCategory = category as IGalleryImage["category"];

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "guesthouse-gallery" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    await dbConnect();
    const image = await GalleryImage.create({
      url: result.secure_url,
      caption,
      category: finalCategory,
      uploadedBy: session.user.id,
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}