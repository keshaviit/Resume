import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useResumeStore } from '../../store/useResumeStore';
import { Zap } from 'lucide-react';

export function ImpactGauge() {

    const [score, setScore] = useState(0);

    useEffect(() => {
        // Zustand subscribe to state changes
        const unsubscribe = useResumeStore.subscribe(() => {
            setScore(useResumeStore.getState().getImpactScore());
        });
        setScore(useResumeStore.getState().getImpactScore());
        return unsubscribe;
    }, []);

    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = Math.max(0, circumference - (score / 100) * circumference);

    return (
        <div className="relative flex flex-col items-center justify-center drop-shadow-2xl">
            <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="3"
                        fill="transparent"
                    />
                    <motion.circle
                        cx="48"
                        cy="48"
                        r={radius}
                        stroke="url(#impactGradient)"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={circumference}
                        animate={{ strokeDashoffset }}
                        transition={{ type: "spring", stiffness: 50, damping: 10 }}
                        strokeLinecap="round"
                    />
                    <defs>
                        <linearGradient id="impactGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#A855F7" />
                            <stop offset="100%" stopColor="#22D3EE" />
                        </linearGradient>
                    </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Zap className="w-4 h-4 text-cyan-400 mb-0.5" />
                    <span className="text-xl font-bold font-heading">{score}</span>
                </div>
            </div>
            <div className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Impact Score</div>
        </div>
    );
}
