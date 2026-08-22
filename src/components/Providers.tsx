"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

function UserIDTracker() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id && typeof window !== 'undefined' && (window as any).gtag) {
      const gtag = (window as any).gtag;
      
      // user_id set karo
      gtag('set', 'user_id', session.user.id);
      gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        user_id: session.user.id,
      });

      // Custom event to "lock in" the user_id into GA4
      gtag('event', 'user_identified', {
        user_id: session.user.id,
      });

      // login event fire karo agar localStorage me loginMethod hai
      const loginMethod = localStorage.getItem('loginMethod');
      if (loginMethod) {
        gtag('event', 'login', {
          method: loginMethod,
          user_id: session.user.id,
        });
        localStorage.removeItem('loginMethod');
      }

      console.log('✅ GA4 user_id set:', session.user.id);
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