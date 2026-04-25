"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ArrowRight, BookOpen, Sparkles } from "lucide-react";

interface Props {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");

  const handleComplete = () => {
    localStorage.setItem("edu_profile", JSON.stringify({ name, subject, level }));
    onComplete();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}}>
            <div className="bg-blue-500/10 p-4 rounded-full inline-block mb-6">
               <GraduationCap className="w-12 h-12 text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold mb-4 font-heading text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Welcome to EduBridge AI</h1>
            <p className="text-slate-300 text-lg mb-8 max-w-md">Your personal AI tutor that adapts to how you learn best.</p>
            <button onClick={() => setStep(1)} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center mx-auto group">
              Get Started <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
        
        {step === 1 && (
          <motion.div key="step1" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}} className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 font-heading">What's your name?</h2>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Enter your name..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all mb-6"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(2)}
            />
            <button onClick={() => setStep(2)} disabled={!name.trim()} className="w-full bg-blue-600 disabled:bg-slate-700 disabled:text-slate-400 text-white px-6 py-4 rounded-xl font-medium transition-all">
              Continue
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}} className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 font-heading">What would you like to learn, {name}?</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {["Math", "Science", "Coding", "English"].map(subj => (
                <button 
                  key={subj} 
                  onClick={() => { setSubject(subj); setStep(3); }} 
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 p-6 rounded-2xl flex flex-col items-center transition-all group"
                >
                  <BookOpen className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-lg">{subj}</span>
                </button>
              ))}
            </div>
             <div className="flex items-center space-x-2 w-full">
              <input 
                type="text" 
                value={subject} 
                onChange={e => setSubject(e.target.value)} 
                placeholder="Or type another subject..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                onKeyDown={e => e.key === 'Enter' && subject.trim() && setStep(3)}
              />
              <button onClick={() => setStep(3)} disabled={!subject.trim()} className="bg-blue-600 disabled:bg-slate-700 text-white px-4 py-3 rounded-xl transition-all">
                <ArrowRight />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}} className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 font-heading">What's your current level in {subject}?</h2>
            <div className="space-y-4 mb-6">
              {[
                { id: "Beginner", desc: "I'm just starting out and need simple explanations." },
                { id: "Intermediate", desc: "I know the basics, but want to learn more." },
                { id: "Advanced", desc: "I want deep dives and complex challenges." }
              ].map(lvl => (
                <button 
                  key={lvl.id} 
                  onClick={() => { setLevel(lvl.id); }} 
                  className={`w-full text-left p-4 rounded-xl border transition-all ${level === lvl.id ? 'bg-blue-600/20 border-blue-500' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}
                >
                  <div className="font-bold text-lg mb-1 flex items-center justify-between">
                    {lvl.id} {level === lvl.id && <Sparkles className="w-5 h-5 text-blue-400" />}
                  </div>
                  <div className="text-slate-400 text-sm">{lvl.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={handleComplete} disabled={!level} className="w-full bg-blue-600 disabled:bg-slate-700 disabled:text-slate-400 text-white px-6 py-4 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]">
              Start Learning
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
