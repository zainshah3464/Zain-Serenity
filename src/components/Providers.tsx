"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

function UserIDTracker() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.id &&
      typeof window !== "undefined" &&
      (window as any).gtag
    ) {
      const gtag = (window as any).gtag;
      const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

      // 1. User-ID feature ke liye (reserved parameter)
      gtag("set", "user_id", session.user.id);

      // 2. Custom User Property (Realtime card me dikhne ke liye)
      //    ⚠️ yahan 'user_id' mat use karo, reserved hai
      gtag("set", "user_properties", {
        crm_user_id: session.user.id,
      });

      // 3. Config update with user_id
      gtag("config", GA_ID, {
        user_id: session.user.id,
      });

      // 4. Event fire karo
      gtag("event", "user_identified", {
        user_id: session.user.id,
      });

      // 5. Login method agar hai
      const loginMethod = localStorage.getItem("loginMethod");
      if (loginMethod) {
        gtag("event", "login", {
          method: loginMethod,
          user_id: session.user.id,
        });
        localStorage.removeItem("loginMethod");
      }
    }
  }, [status, session]);

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