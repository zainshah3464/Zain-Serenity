import { Suspense } from "react";
import LoginContent from "./LoginContent";

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-center text-gray-400 py-12">Loading...</p>}>
      <LoginContent />
    </Suspense>
  );
}