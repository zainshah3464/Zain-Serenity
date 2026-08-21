"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

function UserIDTracker() {
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.user?.id && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        user_id: session.user.id,
      });
    }
  }, [session]);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserIDTracker />
      {children}
    </SessionProvider>
  );
}