"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

function UserIDTracker() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id && typeof window !== 'undefined' && (window as any).gtag) {
      const gtag = (window as any).gtag;
      
      // 1. Set user_id
      gtag('set', 'user_id', session.user.id);
      
      // 2. Update config
      gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        user_id: session.user.id,
      });

      // 3. Fire login event if loginMethod exists in localStorage
      const loginMethod = localStorage.getItem('loginMethod');
      if (loginMethod) {
        gtag('event', 'login', {
          method: loginMethod,
          user_id: session.user.id,
        });
        // Remove stored method to avoid duplicate events on page refresh
        localStorage.removeItem('loginMethod');
      }

      // Debugging (optional)
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