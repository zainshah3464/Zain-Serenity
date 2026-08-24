"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

function UserIDTracker() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id && typeof window !== 'undefined' && (window as any).gtag) {
      const gtag = (window as any).gtag;
      
      // 1. Set user_id (cross-device identifier)
      gtag('set', 'user_id', session.user.id);
      
      // 2. Set user_id as a user property (ye Realtime me dikhega)
      gtag('set', 'user_properties', {
        user_id: session.user.id,
      });

      // 3. Update config with user_id
      gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        user_id: session.user.id,
      });

      // 4. Fire user_identified event (with user_id parameter)
      gtag('event', 'user_identified', {
        user_id: session.user.id,
      });

      // 5. Login event if loginMethod exists
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