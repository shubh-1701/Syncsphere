"use client";

import { motion } from "framer-motion";
import { BookOpen, Flame, Trophy, Play, Settings, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  onStartChat: () => void;
}

export default function Dashboard({ onStartChat }: Props) {
  const [profile, setProfile] = useState<{name: string, subject: string, level: string, language?: string} | null>(null);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const p = localStorage.getItem("edu_profile");
    if (p) {
      setProfile(JSON.parse(p));
    }
    const storedXp = parseInt(localStorage.getItem("edu_xp") || "0");
    setXp(storedXp);
  }, []);

  if (!profile) return null;

  let rank = "Novice";
  let nextGoal = 50;
  if (xp >= 100) {
    rank = "Master";
    nextGoal = 500;
  } else if (xp >= 50) {
    rank = "Scholar";
    nextGoal = 100;
  }
  
  const progressPercent = Math.min(100, Math.round((xp / nextGoal) * 100));

  return (
    <div className="flex flex-col h-full bg-slate-900 border-x border-slate-800 shadow-2xl overflow-y-auto">
      <header className="px-8 py-6 border-b border-slate-800 bg-slate-900 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold font-heading">Welcome back, {profile.name}!</h1>
          <p className="text-slate-400">Ready to master {profile.subject}?</p>
        </div>
        <button onClick={() => {
          localStorage.removeItem("edu_profile");
          localStorage.removeItem("edu_xp");
          window.location.reload();
        }} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-white" title="Reset Profile">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      <div className="p-8 space-y-8 flex-1">
        {/* Gamification Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
          className="bg-slate-800 border border-slate-700 p-6 rounded-3xl"
        >
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-sm text-slate-400 font-medium mb-1">Current Rank</p>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 flex items-center">
                <Star className="w-6 h-6 mr-2 text-purple-400" /> {rank}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-white">{xp}</span>
              <span className="text-slate-400 text-sm ml-1">XP</span>
            </div>
          </div>
          
          <div className="w-full bg-slate-900 rounded-full h-3 mb-2 overflow-hidden border border-slate-700">
            <motion.div 
              initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} 
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
            />
          </div>
          <p className="text-xs text-right text-slate-500">{Math.max(0, nextGoal - xp)} XP to next rank</p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-orange-500/10 border border-orange-500/20 p-5 rounded-3xl flex items-center space-x-4"
          >
            <div className="bg-orange-500/20 p-3 rounded-2xl">
              <Flame className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-orange-200/60 font-medium">Daily Streak</p>
              <p className="text-2xl font-bold text-orange-400">3 Days</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-3xl flex items-center space-x-4"
          >
            <div className="bg-blue-500/20 p-3 rounded-2xl">
              <Trophy className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-blue-200/60 font-medium">Mastery Level</p>
              <p className="text-2xl font-bold text-blue-400">{profile.level}</p>
            </div>
          </motion.div>
        </div>

        {/* Current Focus */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
          className="bg-slate-800 border border-slate-700 p-8 rounded-3xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <BookOpen className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <h2 className="text-lg text-slate-400 font-medium mb-1">Current Subject</h2>
            <h3 className="text-4xl font-bold text-white mb-6">{profile.subject}</h3>
            
            <div className="flex items-center space-x-4">
              <span className="bg-slate-700 px-3 py-1 rounded-full text-sm">{profile.language || 'English'}</span>
              <span className="bg-slate-700 px-3 py-1 rounded-full text-sm">{profile.level}</span>
            </div>

            <button 
              onClick={onStartChat}
              className="mt-8 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center group w-full justify-center"
            >
              Resume Learning <Play className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform fill-current" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
