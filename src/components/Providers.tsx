"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

function UserIDTracker() {
  const { data: session, status } = useSession();
  const prevStatus = useRef(status);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        // user_id set karo
        (window as any).gtag('set', 'user_id', session.user.id);
        // config update karo (future events ke liye)
        (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
          user_id: session.user.id,
        });

        // agar pehle authenticated nahi tha, to login event fire karo
        if (prevStatus.current !== 'authenticated') {
          (window as any).gtag('event', 'login', {
            method: 'credentials', // ya 'google' depending
          });
        }
      }
    }
    prevStatus.current = status;
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