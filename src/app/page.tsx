"use client";

import { useState, useEffect } from "react";
import Onboarding from "@/components/Onboarding";
import Chat from "@/components/Chat";

export default function Home() {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  
  useEffect(() => {
    const profile = localStorage.getItem("edu_profile");
    setHasProfile(!!profile);
  }, []);

  if (hasProfile === null) {
    return <div className="flex h-screen items-center justify-center"><div className="animate-pulse flex flex-col items-center"><div className="h-8 w-8 rounded-full border-4 border-t-blue-500 animate-spin"></div><p className="mt-4 text-slate-400">Loading...</p></div></div>;
  }

  return (
    <main className="flex-1 flex flex-col h-screen max-w-3xl mx-auto w-full relative">
      {hasProfile ? <Chat /> : <Onboarding onComplete={() => setHasProfile(true)} />}
    </main>
  );
}
