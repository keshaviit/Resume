import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Moon, Briefcase } from 'lucide-react';

type Theme = 'cyberpunk' | 'minimalist' | 'executive';

export function ThemeSwitcher() {
    const [theme, setTheme] = useState<Theme>('cyberpunk');

    useEffect(() => {
        // In a full implementation, this would manipulate document classes or CSS variables
        // For now we just set a data attribute to show the logic
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const themes: { id: Theme; icon: React.ReactNode; label: string }[] = [
        { id: 'cyberpunk', icon: <Moon className="w-4 h-4" />, label: 'Cyberpunk' },
        { id: 'minimalist', icon: <Monitor className="w-4 h-4" />, label: 'Minimalist' },
        { id: 'executive', icon: <Briefcase className="w-4 h-4" />, label: 'Executive' },
    ];

    return (
        <div className="relative flex items-center bg-black/40 border border-white/10 rounded-full p-1 backdrop-blur-md">
            {themes.map((t) => {
                const isActive = theme === t.id;
                return (
                    <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`relative flex items-center justify-center w-10 h-8 rounded-full transition-colors duration-200 z-10 ${isActive ? 'text-white' : 'text-white/40 hover:text-white/80'
                            }`}
                        title={t.label}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="theme-bubble"
                                className="absolute inset-0 bg-white/10 rounded-full border border-white/20"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-20">{t.icon}</span>
                    </button>
                );
            })}
        </div>
    );
}
