// app/about/page.tsx
import { Metadata } from "next";
import AboutContent from "@/components/AboutContent";

export const metadata: Metadata = {
  title: "About Us | Zain's Serenity",
  description: "Our story – Zain's Serenity on the Crystal Coast of Mauritius.",
};

export default function AboutPage() {
  return <AboutContent />;
}