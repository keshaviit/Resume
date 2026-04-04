import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Moon, Briefcase } from 'lucide-react';

import { useResumeStore } from '../../store/useResumeStore';

type Theme = 'cyberpunk' | 'minimalist' | 'executive';

export function ThemeSwitcher() {
    const { theme, updateField } = useResumeStore();

    useEffect(() => {
        // We set the data-theme attribute, though DirectorsCut relies heavily on the React state directly now.
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const themes: { id: Theme; icon: React.ReactNode; label: string }[] = [
        { id: 'cyberpunk', icon: <Moon className="w-4 h-4" />, label: 'Cyberpunk' },
        { id: 'minimalist', icon: <Monitor className="w-4 h-4" />, label: 'Minimalist' },
        { id: 'executive', icon: <Briefcase className="w-4 h-4" />, label: 'Executive' },
    ];

    return (
        <div className="relative flex items-center bg-black/40 border border-white/10 rounded-full p-1 backdrop-blur-md shadow-2xl z-50">
            {themes.map((t) => {
                const isActive = theme === t.id;
                return (
                    <motion.button
                        key={t.id}
                        onClick={() => updateField('theme', t.id)}
                        whileHover={{ scale: 1.1, rotateX: 15, rotateY: 15 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative flex items-center justify-center w-10 h-8 rounded-full transition-colors duration-200 z-10 ${isActive ? 'text-white' : 'text-white/40 hover:text-white/80'
                            }`}
                        title={t.label}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="theme-bubble"
                                className="absolute inset-0 bg-white/10 rounded-full border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                                transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-20 pointer-events-none">{t.icon}</span>
                    </motion.button>
                );
            })}
        </div>
    );
}
