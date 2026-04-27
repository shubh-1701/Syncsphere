"use client";

import { useState, useEffect } from "react";
import Login from "@/components/Login";
import Onboarding from "@/components/Onboarding";
import Dashboard from "@/components/Dashboard";
import Chat from "@/components/Chat";

export default function Home() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [showChat, setShowChat] = useState<boolean>(false);
  
  useEffect(() => {
    const token = localStorage.getItem("edu_auth_token");
    const profile = localStorage.getItem("edu_profile");
    setIsAuth(!!token);
    setHasProfile(!!profile);
  }, []);

  if (isAuth === null || hasProfile === null) {
    return <div className="flex h-screen items-center justify-center"><div className="animate-pulse flex flex-col items-center"><div className="h-8 w-8 rounded-full border-4 border-t-blue-500 animate-spin"></div><p className="mt-4 text-slate-400">Loading...</p></div></div>;
  }

  return (
    <main className="flex-1 flex flex-col h-screen max-w-3xl mx-auto w-full relative">
      {!isAuth ? (
        <Login onLogin={() => setIsAuth(true)} />
      ) : !hasProfile ? (
        <Onboarding onComplete={() => setHasProfile(true)} />
      ) : !showChat ? (
        <Dashboard onStartChat={() => setShowChat(true)} />
      ) : (
        <Chat onBack={() => setShowChat(false)} />
      )}
    </main>
  );
}
