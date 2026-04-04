import { useResumeStore } from '../../store/useResumeStore';
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate } from 'framer-motion';
import { ExternalLink, Phone, Monitor, Smartphone, Layout, Moon, Sun } from 'lucide-react';
import React, { useRef, useEffect } from 'react';

// Custom Trailing Interactive Ball Cursor
function TrailingCursor() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    
    // Heavier, lazier spring physics for the trailing ball aesthetic
    const springConfig = { damping: 30, stiffness: 150, mass: 0.8 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
        };
        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, [cursorX, cursorY]);

    return (
        <motion.div 
            style={{ x: springX, y: springY }}
            className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#1C2A31] mix-blend-difference pointer-events-none z-[9999]"
        />
    );
}

// Prominent Floating Theme Widget
function FloatingThemeToggle({ isLight, onToggle }: { isLight: boolean, onToggle: () => void }) {
    return (
        <motion.button 
            whileHover={{ scale: 1.15, rotate: isLight ? 15 : -15 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggle}
            title={`Switch to ${isLight ? 'Dark Cyberpunk' : 'Light Editorial'} Mode`}
            className={`fixed bottom-8 right-8 p-4 rounded-full shadow-2xl z-[9000] cursor-none border transition-colors duration-700 ${isLight ? 'bg-white border-slate-200 text-slate-800 hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)]' : 'bg-[#0a0b14] border-white/20 text-yellow-400 hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] backdrop-blur-lg'}`}
        >
            {isLight ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
        </motion.button>
    )
}

// Magnetic Glowing Service Card Component
function MagneticServiceCard({ skill, i, isLight, Icon, colorClass, projectsCount }: any) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ clientX, clientY, currentTarget }: any) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, type: "spring" }}
            whileHover={{ scale: 1.05, z: 20, rotateX: 5 }}
            onMouseMove={handleMouseMove}
            style={{ transformStyle: "preserve-3d" }}
            className={`relative flex items-center gap-8 p-8 md:p-10 rounded-[2rem] border transition-colors cursor-none group overflow-hidden ${isLight ? 'bg-white border-slate-100 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-5px_rgba(0,0,0,0.1)]' : 'bg-white/5 border-white/5 backdrop-blur-md shadow-[0_15px_40px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_60px_-5px_rgba(168,85,247,0.3)] hover:border-purple-500/30'}`}
        >
            {/* Magnetic Glow Effect following cursor */}
            <motion.div
                className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${isLight ? 'rgba(0,0,0,0.04)' : 'rgba(34,211,238,0.15)'}, transparent 80%)` }}
            />

            <div style={{ transform: "translateZ(30px)" }} className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${colorClass} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform relative z-10`}>
                <Icon className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div style={{ transform: "translateZ(20px)" }} className="relative z-10">
                <h3 className={`text-2xl md:text-3xl font-heading font-black tracking-tight mb-2 transition-colors ${isLight ? 'text-[#1C2A31]' : 'text-white'}`}>{skill}</h3>
                <p className={`text-sm font-bold uppercase tracking-widest transition-colors ${isLight ? 'text-slate-500' : 'text-white/40'}`}>{projectsCount} Projects</p>
            </div>
        </motion.div>
    );
}

// A specialized 3D Card component for Projects featuring Vercel-Style Live IFrames
function ProjectCard3D({ proj, isLight }: { proj: any, isLight: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [8, -8]);
    const rotateY = useTransform(x, [-100, 100], [-8, 8]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    };

    const handleMouseLeave = () => { x.set(0); y.set(0); };

    return (
        <div style={{ perspective: 1200 }} className="w-full h-full flex justify-center items-center cursor-none">
            <motion.div
                ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                whileHover={{ scale: 1.02, z: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`relative w-full rounded-[2rem] border overflow-hidden flex flex-col shadow-xl transition-all hover:shadow-2xl ${isLight ? 'bg-white border-slate-200' : 'bg-[#0a0b14] border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.15)]'}`}
            >
                {/* Vercel-style Live Thumbnail or Image Fallback */}
                <div style={{ transform: "translateZ(30px)" }} className={`w-full h-64 md:h-72 overflow-hidden border-b shrink-0 relative group ${isLight ? 'border-slate-100 bg-slate-50' : 'border-white/10 bg-black/50'}`}>
                    {proj.link && !proj.image_url ? (
                        <>
                            {/* Scaled IFrame Live Preview */}
                            <div className={`absolute top-0 left-0 w-[400%] h-[400%] origin-top-left pointer-events-none transition-transform duration-1000 group-hover:scale-[0.27] z-0 scale-[0.25]`}>
                                <iframe src={proj.link} className="w-full h-full border-none opacity-80 group-hover:opacity-100 transition-opacity duration-700" title={proj.title} sandbox="allow-scripts allow-same-origin"/>
                            </div>
                            {/* Overlay Blockings Clicks */}
                            <div className="absolute inset-0 bg-transparent z-10" />
                        </>
                    ) : proj.image_url ? (
                        <img src={proj.image_url} alt={proj.title} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!isLight && 'opacity-80 group-hover:opacity-100 mix-blend-screen'}`} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-10">No Preview Found</div>
                    )}
                </div>
                
                <div style={{ transform: "translateZ(40px)" }} className="p-8 md:p-10 flex flex-col flex-1 relative z-10 pointer-events-auto">
                    <h3 className={`text-3xl font-bold font-heading mb-4 tracking-tight ${isLight ? 'text-[#1C2A31]' : 'text-white'}`}>{proj.title}</h3>
                    <p className={`leading-relaxed mb-6 flex-1 ${isLight ? 'text-slate-600' : 'text-white/60'}`}>{proj.description}</p>
                    
                    {proj.key_features && proj.key_features.length > 0 && (
                        <div className="mb-6">
                            <h4 className={`text-xs uppercase tracking-widest font-bold mb-3 ${isLight ? 'text-[#215E63]' : 'text-cyan-400'}`}>Key Features:</h4>
                            <ul className="space-y-2">
                                {proj.key_features.map((feature: string, idx: number) => (
                                    <li key={idx} className={`flex items-start text-sm font-medium ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 mr-3 shrink-0 ${isLight ? 'bg-[#D46B55]' : 'bg-purple-500 shadow-[0_0_8px_purple]'}`} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                        {proj.tags?.map((tag: string, tIdx: number) => (
                            <span key={tIdx} className={`px-4 py-1.5 text-xs font-bold border rounded-full tracking-wide ${isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-white/10 bg-white/5 text-purple-200'}`}>
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className={`flex items-center gap-6 mt-4 pt-6 border-t ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
                        {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm font-bold group/link px-5 py-2.5 rounded-full transition-all shadow-md group border cursor-none ${isLight ? 'text-white bg-[#1C2A31] hover:bg-slate-800 border-transparent' : 'text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]'}`}>
                                <ExternalLink className="w-4 h-4" /> Live Demo
                            </a>
                        )}
                        {proj.github_link && (
                            <a href={proj.github_link} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm font-bold transition-all cursor-none ${isLight ? 'text-slate-500 hover:text-[#1C2A31]' : 'text-white/40 hover:text-white'}`}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> GitHub
                                <ExternalLink className="w-3 h-3 opacity-50" />
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// 3D Avatar/Blob Section for the Hero
function HeroAvatar3D({ avatar_url, name, isLight }: { avatar_url: string, name: string, isLight: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    };

    const handleMouseLeave = () => { x.set(0); y.set(0); };

    return (
        <div style={{ perspective: 1200 }} className="w-full md:w-1/3 relative h-[500px] md:h-[600px] flex justify-center items-center my-12 md:my-0 z-10 cursor-none">
            <motion.div
                ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative w-full h-full flex justify-center items-center"
            >
                {/* Blob SVG Background in 3D Space */}
                <div style={{ transform: "translateZ(-30px)" }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full max-w-[600px] opacity-90 transition-all duration-700 drop-shadow-2xl ${isLight ? 'text-[#215E63]' : 'text-cyan-500/80 drop-shadow-[0_0_60px_rgba(34,211,238,0.5)]'}`}>
                        <path fill="currentColor" transform="translate(100 100) scale(1.1) rotate(15)" d="M51.7,-64.1C65.5,-51.7,73.8,-32.1,75.9,-12.3C78,7.5,74.1,27.5,62.8,42.7C51.5,57.9,32.9,68.4,12.7,71.2C-7.4,74.1,-29.2,69.4,-44.6,56.7C-60,43.9,-69,23.3,-71,-2.4C-73,-28.1,-68,-53.4,-53.2,-65.9C-38.4,-78.4,-13.7,-78.1,3.4,-82.1C20.5,-86.1,41,-89.4,51.7,-64.1Z" />
                    </svg>
                </div>
                
                {/* Foreground Image in 3D Space */}
                {avatar_url && (
                    <motion.img 
                        initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ transform: "translateZ(50px)" }}
                        src={avatar_url} alt={name} 
                        className={`w-full h-full max-w-[400px] object-contain object-bottom relative z-10 drop-shadow-2xl transition-all duration-700 ${!isLight && 'drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]'}`} 
                    />
                )}
            </motion.div>
        </div>
    );
}

export function DirectorsCut() {
    const { name, role, summary, skills, projects, experience, socials, avatar_url, logo_url, achievements, theme, updateField } = useResumeStore();

    // Derived properties
    const isLight = theme === 'minimalist';
    const firstName = name ? name.split(' ')[0] : 'Binjan';
    const email = socials?.find(s => s.platform.toLowerCase().includes('email'))?.link?.replace('mailto:', '') || `${firstName.toLowerCase()}@gmail.com`;
    const phone = socials?.find(s => s.platform.toLowerCase().includes('phone'))?.link || '+001 (313) 345 678';
    const totalExperience = experience.length > 0 ? experience.length * 2 : 10;
    
    // Skill card setup
    const defaultIcons = [Monitor, Smartphone, Layout];
    const defaultColors = isLight ? ['bg-[#1F6E65]', 'bg-[#F9C34A]', 'bg-[#F26A5A]'] : ['bg-cyan-900 shadow-[0_0_20px_cyan]', 'bg-purple-900 shadow-[0_0_20px_purple]', 'bg-[#D46B55] shadow-[0_0_20px_#D46B55]'];
    const displayedSkills = skills.length >= 3 ? skills.slice(0, 3) : ['Website Design', 'Mobile App Design', 'Brand Identity'];

    return (
        <div className={`w-full h-full overflow-y-auto overflow-x-hidden relative font-body custom-scrollbar transition-colors duration-700 cursor-none ${isLight ? 'bg-white text-[#1C2A31]' : 'bg-[#05050A] text-white'}`}>
            
            {/* Interactive Components */}
            <TrailingCursor />
            <FloatingThemeToggle isLight={isLight} onToggle={() => updateField('theme', isLight ? 'cyberpunk' : 'minimalist')} />

            {/* Cinematic Cyberpunk Orbs for Dark Mode */}
            {!isLight && (
                <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                    <div className="absolute top-[20%] right-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-purple-600/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[10%] left-[5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-cyan-600/10 rounded-full blur-[100px]" />
                </div>
            )}

            {/* Hero Layer */}
            <div className={`transition-colors duration-700 pb-24 border-b relative z-10 ${isLight ? 'bg-[#FAF9F6] border-slate-200' : 'bg-transparent border-white/5 backdrop-blur-3xl'}`}>
                
                {/* Navbar matching Image */}
                <nav className="flex items-center justify-between py-8 px-8 md:px-16 w-full max-w-[1600px] mx-auto z-50 relative pointer-events-auto">
                    <div className={`text-3xl font-heading font-black tracking-tighter italic cursor-none ${isLight ? 'text-[#1C2A31]' : 'text-white drop-shadow-[0_0_10px_white]'}`}>
                        {logo_url ? <img src={logo_url} alt={name} className="h-10 w-auto object-contain" /> : (name || 'Binjan')}
                    </div>
                    
                    <ul className={`hidden lg:flex items-center gap-12 text-xs font-black tracking-widest uppercase transition-colors duration-700 ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
                        <li><a href="#skills" className={`flex items-center gap-3 transition-colors cursor-none ${isLight ? 'hover:text-[#215E63] text-[#215E63]' : 'hover:text-cyan-400 text-cyan-400'}`}><span className={`w-3 h-[1px] ${isLight ? 'bg-[#215E63]' : 'bg-cyan-400'}`}></span> SERVICES <span className={`w-3 h-[1px] ${isLight ? 'bg-[#215E63]' : 'bg-cyan-400'}`}></span></a></li>
                        <li><a href="#projects" className={`transition-colors cursor-none ${isLight ? 'hover:text-[#215E63]' : 'hover:text-cyan-400'}`}>WORKS</a></li>
                        <li><a href="#experience" className={`transition-colors cursor-none ${isLight ? 'hover:text-[#215E63]' : 'hover:text-cyan-400'}`}>EXPERIENCE</a></li>
                        <li><a href="#achievements" className={`transition-colors cursor-none ${isLight ? 'hover:text-[#215E63]' : 'hover:text-cyan-400'}`}>AWARDS</a></li>
                    </ul>

                    <div className={`flex items-center gap-4 text-xs font-black tracking-wider transition-colors duration-700 ${isLight ? 'text-[#1C2A31]' : 'text-white/80'}`}>
                        <span className="hidden md:inline ml-2">{phone}</span>
                        <a href={`tel:${phone}`} className={`flex items-center justify-center p-3 rounded-full shadow-sm hover:scale-105 transition-transform cursor-none ${isLight ? 'bg-white border border-slate-100 text-[#215E63]' : 'bg-white/10 border border-white/20 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]'}`}>
                            <Phone className="w-4 h-4" />
                        </a>
                    </div>
                </nav>

                {/* Hero Content Grid */}
                <section id="hero" className="w-full max-w-[1600px] mx-auto px-8 md:px-16 relative min-h-[70vh] flex flex-col md:flex-row items-center justify-between mt-12 z-10 pointer-events-auto">
                    
                    {/* Left Typography */}
                    <div className="w-full md:w-1/3 flex flex-col z-20 text-center md:text-left">
                        <motion.h1 
                            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
                            className={`text-6xl md:text-7xl lg:text-[5.5rem] font-bold font-heading leading-[1.1] tracking-tight mb-20 transition-colors duration-700 ${isLight ? 'text-[#1C2A31]' : 'text-white drop-shadow-md'}`}
                        >
                            Hey There, <br /> I'm {firstName}
                        </motion.h1>

                        <motion.a 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                            href={`mailto:${email}`}
                            className={`font-bold text-lg mb-20 hover:text-opacity-80 underline decoration-2 underline-offset-4 transition-colors duration-700 cursor-none ${isLight ? 'text-[#D46B55]' : 'text-cyan-300 drop-shadow-[0_0_8px_cyan]'}`}
                        >
                            {email}
                        </motion.a>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex items-center gap-4 justify-center md:justify-start">
                            <span className={`text-6xl md:text-7xl font-bold font-heading transition-colors duration-700 ${isLight ? 'text-[#1C2A31]' : 'text-white drop-shadow-md'}`}>{totalExperience}</span>
                            <div className={`flex flex-col text-sm font-black tracking-widest uppercase leading-snug transition-colors duration-700 ${isLight ? 'text-slate-500' : 'text-white/40'}`}>
                                <span>YEARS</span>
                                <span>EXPERIENCE</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Interactive 3D Physics Center Blob */}
                    <HeroAvatar3D avatar_url={avatar_url} name={name} isLight={isLight} />

                    {/* Right Typography */}
                    <div className="w-full md:w-1/3 flex flex-col justify-between items-center md:items-end z-20 text-center md:text-right h-[400px]">
                        <motion.p 
                            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                            className={`text-lg md:text-xl font-medium leading-relaxed max-w-xs mt-12 md:mt-24 transition-colors duration-700 ${isLight ? 'text-slate-800' : 'text-white/80'}`}
                        >
                            I design beautifully simple things, And I love what i do.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}
                            className="flex flex-col items-center md:items-end gap-6 mb-12 group cursor-none pointer-events-auto"
                        >
                            <div className={`w-24 h-24 rounded-full border flex items-center justify-center relative spin-slow p-2 shadow-xl transition-colors duration-700 ${isLight ? 'border-slate-300 bg-white' : 'border-white/20 bg-white/5 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]'}`}>
                                <svg className={`w-full h-full transition-colors duration-700 ${isLight ? 'text-[#1C2A31]' : 'text-white'}`} viewBox="0 0 100 100" fill="currentColor">
                                    <path d="M50 10C27.9 10 10 27.9 10 50s17.9 40 40 40 40-17.9 40-40S72.1 10 50 10zm-5 60h10v10H45V70zm11.7-22.1c-1.3 1.1-2.2 2-2.7 3.6h-8c.4-3.5 2-5.4 4.5-7.4 2.1-1.7 3.5-2.8 3.5-5.1 0-2.4-1.8-4-4.5-4-2.8 0-4.6 1.8-5 5H41c.4-6.6 4.9-10 10-10 6.1 0 10.5 4.1 10.5 9 0 3.7-2.3 6.3-4.8 8.3z"/>
                                </svg>
                            </div>
                            <div className={`text-sm font-black tracking-widest uppercase leading-relaxed md:text-right transition-colors duration-700 ${isLight ? 'text-[#1C2A31]' : 'text-cyan-200 drop-shadow-md'}`}>
                                {role ? role.replace(' ', '\n') : 'IDF CERTIFIED\nPROFESSIONAL\nUI/UX DESIGNER'}
                            </div>
                        </motion.div>
                    </div>

                </section>
            </div>

            {/* "What do I help?" (Skills / Services) Section mapped with Magnetic Lighting */}
            <section id="skills" className={`w-full max-w-[1600px] mx-auto py-32 px-8 md:px-16 flex flex-col lg:flex-row gap-20 xl:gap-32 relative z-20 pointer-events-auto transition-colors duration-700 ${isLight ? 'bg-white' : 'bg-transparent'}`}>
                
                {/* Left - Service Cards */}
                <div className="w-full lg:w-5/12 flex flex-col gap-6" style={{ perspective: 1200 }}>
                    {displayedSkills.map((skill, i) => {
                        const Icon = defaultIcons[i % defaultIcons.length];
                        const colorClass = defaultColors[i % defaultColors.length];
                        return <MagneticServiceCard key={i} skill={skill} i={i} isLight={isLight} Icon={Icon} colorClass={colorClass} projectsCount={(projects.length || 1) * (i+1) * 3} />
                    })}
                </div>

                {/* Right - Typography & Stats */}
                <div className="w-full lg:w-7/12 flex flex-col justify-center">
                    <motion.h2 
                        initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        className={`text-6xl md:text-7xl lg:text-[5.5rem] font-bold font-heading leading-[1.1] tracking-tight mb-12 transition-colors duration-700 ${isLight ? 'text-[#1C2A31]' : 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]'}`}
                    >
                        What do I help?
                    </motion.h2>
                    
                    <motion.div 
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                        className={`text-lg md:text-xl leading-[2] font-medium max-w-2xl transition-colors duration-700 ${isLight ? 'text-slate-600' : 'text-white/70'}`}
                    >
                        {summary ? (
                            <p>{summary}</p>
                        ) : (
                            <>
                                <p className="mb-6">I will help you with finding a solution and solve your problems, We use process design to create digital products. Besides that also help their business.</p>
                                <p>We use process design to create digital products. Besides that also help their business.</p>
                            </>
                        )}
                    </motion.div>

                    {/* Huge Stats Row */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
                        className={`flex items-center gap-16 md:gap-32 mt-20 pt-16 border-t transition-colors duration-700 ${isLight ? 'border-slate-100' : 'border-white/10'}`}
                    >
                        <div>
                            <h3 className={`text-6xl md:text-7xl lg:text-8xl font-black font-heading tracking-tighter mb-4 transition-colors duration-700 ${isLight ? 'text-[#1C2A31]' : 'text-white drop-shadow-md'}`}>
                                {projects.length > 0 ? projects.length * 28 : (285)}+
                            </h3>
                            <p className={`text-sm font-bold tracking-widest uppercase transition-colors duration-700 ${isLight ? 'text-[#215E63]' : 'text-cyan-400 drop-shadow-[0_0_8px_cyan]'}`}>Project Completed</p>
                        </div>
                        <div>
                            <h3 className={`text-6xl md:text-7xl lg:text-8xl font-black font-heading tracking-tighter mb-4 transition-colors duration-700 ${isLight ? 'text-[#1C2A31]' : 'text-white drop-shadow-md'}`}>
                                190+
                            </h3>
                            <p className={`text-sm font-bold tracking-widest uppercase transition-colors duration-700 ${isLight ? 'text-slate-500' : 'text-white/40'}`}>Happy Clients</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Selected Work — Cinematic Project Cards */}
            <section id="projects" className={`border-t py-32 px-8 md:px-16 pointer-events-auto relative z-10 w-full max-w-[1600px] mx-auto rounded-[3rem] my-12 transition-colors duration-700 hidden md:block ${isLight ? 'bg-[#FAF9F6] border-slate-200' : 'bg-black/40 border-white/5 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)]'}`}>
                <h2 className={`text-5xl md:text-6xl font-heading font-black tracking-tight mb-20 text-center transition-colors duration-700 ${isLight ? 'text-[#1C2A31]' : 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]'}`}>Selected Works</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {projects.map((proj) => (
                        <ProjectCard3D key={proj.id} proj={proj} isLight={isLight} />
                    ))}
                </div>
            </section>

            {/* Experience Timeline */}
            {experience && experience.length > 0 && (
                <section id="experience" className={`py-32 px-8 md:px-16 w-full max-w-[1200px] mx-auto relative z-10 pointer-events-auto transition-colors duration-700 px-4 md:px-8`}>
                    <h2 className={`text-4xl md:text-5xl font-heading font-black tracking-tight mb-16 text-center transition-colors duration-700 ${isLight ? 'text-[#1C2A31]' : 'text-white'}`}>Career Journey</h2>
                    <div className={`relative border-l-2 ml-4 md:ml-16 transition-colors duration-700 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                        {experience.map((exp, idx) => (
                            <motion.div key={exp.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="mb-16 pl-10 relative group cursor-none">
                                <div className={`absolute -left-[11px] top-1.5 w-5 h-5 rounded-full transition-all duration-700 group-hover:scale-125 ${isLight ? 'bg-[#D46B55] shadow-[0_0_0_5px_#FAF9F6]' : 'bg-cyan-500 shadow-[0_0_15px_cyan] shadow-[0_0_0_5px_#05050A]'}`} />
                                <h3 className={`text-3xl font-bold font-heading mb-2 transition-colors ${isLight ? 'text-[#1C2A31] group-hover:text-[#D46B55]' : 'text-white group-hover:text-cyan-400'}`}>{exp.role}</h3>
                                <div className={`flex flex-wrap items-center gap-4 text-sm font-bold uppercase tracking-widest mb-6 transition-colors ${isLight ? 'text-[#215E63]' : 'text-purple-400'}`}>
                                    <span>{exp.company}</span>
                                    <span className="hidden md:inline">•</span>
                                    <span className={`px-4 py-1.5 rounded-full border text-xs transition-colors ${isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-white/50'}`}>{exp.date}</span>
                                </div>
                                <p className={`leading-relaxed max-w-3xl text-lg transition-colors ${isLight ? 'text-slate-600' : 'text-white/70'}`}>{exp.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Achievements Showcase */}
            {achievements && achievements.length > 0 && (
                <section id="achievements" className={`py-32 px-8 md:px-16 w-full max-w-[1600px] mx-auto border-t relative z-10 pointer-events-auto transition-colors duration-700 ${isLight ? 'border-slate-100 bg-[#FAF9F6]' : 'border-white/10 bg-black/20 backdrop-blur-md'}`}>
                    <h2 className={`text-4xl md:text-5xl font-heading font-black tracking-tight mb-16 text-center transition-colors duration-700 ${isLight ? 'text-[#1C2A31]' : 'text-white'}`}>Awards & Achievements</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {achievements.map((ach, idx) => (
                            <motion.div key={ach.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className={`p-10 rounded-[2rem] border transition-all cursor-none group hover:-translate-y-2 ${isLight ? 'bg-white border-slate-200 shadow-xl hover:shadow-2xl' : 'bg-white/5 border-white/10 shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:border-cyan-500/50 hover:shadow-[0_0_50px_rgba(34,211,238,0.3)] hover:bg-white/10'}`}>
                                <div className={`text-xs font-bold tracking-widest uppercase mb-6 px-4 py-1.5 inline-block rounded-full border transition-colors ${isLight ? 'bg-[#D46B55]/10 text-[#D46B55] border-[#D46B55]/20' : 'bg-purple-500/20 text-purple-300 border-purple-500/30'}`}>{ach.date}</div>
                                <h3 className={`text-2xl font-bold font-heading mb-4 transition-colors ${isLight ? 'text-[#1C2A31]' : 'text-white'}`}>{ach.title}</h3>
                                <div className={`text-sm font-bold uppercase tracking-widest mb-6 transition-colors ${isLight ? 'text-[#215E63]' : 'text-cyan-400'}`}>{ach.event}</div>
                                <p className={`leading-relaxed transition-colors ${isLight ? 'text-slate-600' : 'text-white/60 group-hover:text-white/80'}`}>{ach.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
}
