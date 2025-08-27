// app/providers.tsx
"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { APIProvider } from "@vis.gl/react-google-maps";
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <APIProvider
      apiKey={API_KEY}
      version={"beta"}
      libraries={["marker", "places"]}
    >
      <HeroUIProvider>
        <ToastProvider />
        {children}
      </HeroUIProvider>
    </APIProvider>
  );
}
