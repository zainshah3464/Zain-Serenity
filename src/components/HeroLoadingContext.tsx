"use client";
import { createContext, useContext, useState } from "react";

interface HeroLoadingContextType {
  isHeroLoading: boolean;
  setIsHeroLoading: (loading: boolean) => void;
}

const HeroLoadingContext = createContext<HeroLoadingContextType>({
  isHeroLoading: false,
  setIsHeroLoading: () => {},
});

export function HeroLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isHeroLoading, setIsHeroLoading] = useState(true);
  return (
    <HeroLoadingContext.Provider value={{ isHeroLoading, setIsHeroLoading }}>
      {children}
    </HeroLoadingContext.Provider>
  );
}

export const useHeroLoading = () => useContext(HeroLoadingContext);