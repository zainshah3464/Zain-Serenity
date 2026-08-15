import { Suspense } from "react";
import ResetPasswordContent from "./ResetPasswordContent";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-gray-400 py-12">
          Loading...
        </p>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}