import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import GalleryImage from "@/models/GalleryImage";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  await dbConnect();
  let query = {};
  if (category && category !== "all") {
    query = { category };
  }
  const images = await GalleryImage.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json(images);
}