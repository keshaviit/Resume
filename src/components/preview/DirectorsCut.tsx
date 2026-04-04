import { useResumeStore } from '../../store/useResumeStore';
import { motion, useMotionValue, useTransform, useInView } from 'framer-motion';
import { ExternalLink, Moon, Sun, PlayCircle } from 'lucide-react';
import React, { useRef, useMemo } from 'react';

// Pre-seed random positions once — NEVER recalculate on re-render
const SEEDED_POSITIONS = Array.from({ length: 40 }, () => ({
    x: (Math.random() - 0.5) * 700,
    rot: (Math.random() - 0.5) * 180,
    floatY: 8 + Math.random() * 14,
    floatDuration: 2.5 + Math.random() * 2,
    floatDelay: Math.random() * 2,
}));

// 3D Glossy Sphere color palette
const SPHERE_COLORS = [
    { bg: 'radial-gradient(circle at 35% 30%, #a8e6cf, #2ecc71 45%, #1a7a42 80%, #0d3d21)', shadow: 'rgba(46,204,113,0.6)' },
    { bg: 'radial-gradient(circle at 35% 30%, #ffd3a5, #f39c12 45%, #8a5a00 80%, #4a3000)', shadow: 'rgba(243,156,18,0.6)' },
    { bg: 'radial-gradient(circle at 35% 30%, #ffa8a8, #e74c3c 45%, #8a1c1c 80%, #4a0a0a)', shadow: 'rgba(231,76,60,0.6)' },
    { bg: 'radial-gradient(circle at 35% 30%, #a8c8ff, #3498db 45%, #1a5fa0 80%, #0a2d50)', shadow: 'rgba(52,152,219,0.6)' },
    { bg: 'radial-gradient(circle at 35% 30%, #d4a8ff, #9b59b6 45%, #5a1a8a 80%, #2d0d45)', shadow: 'rgba(155,89,182,0.6)' },
    { bg: 'radial-gradient(circle at 35% 30%, #a8f5ff, #1abc9c 45%, #0a7a6a 80%, #053d35)', shadow: 'rgba(26,188,156,0.6)' },
];

// SkillsArena — 3D Glossy Spheres falling once and floating permanently
function SkillsArena({ skills, isLight }: { skills: string[], isLight: boolean }) {
    const arenaRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(arenaRef, { once: true, margin: '-80px' });
    const seedPos = useMemo(() => SEEDED_POSITIONS.slice(0, skills.length), [skills.length]);

    return (
        <div
            ref={arenaRef}
            className={`relative w-full min-h-[580px] rounded-[3rem] overflow-hidden flex flex-wrap justify-center items-end p-8 gap-6 border-2 transition-colors duration-700 ${
                isLight
                    ? 'bg-gradient-to-b from-slate-100 to-slate-50 border-slate-200 shadow-[inset_0_2px_30px_rgba(0,0,0,0.05)]'
                    : 'bg-gradient-to-b from-[#06060e] to-[#0a0a14] border-white/5 shadow-[inset_0_0_80px_rgba(0,0,0,0.5)]'
            }`}
        >
            {/* Atmospheric background glows */}
            {!isLight && (
                <>
                    <div className="absolute top-8 left-[20%] w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-12 right-[15%] w-56 h-56 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-600/8 rounded-full blur-3xl pointer-events-none" />
                </>
            )}

            {skills.map((skill, i) => {
                const color = SPHERE_COLORS[i % SPHERE_COLORS.length];
                const pos = seedPos[i] ?? SEEDED_POSITIONS[0];

                return (
                    <motion.div
                        key={skill}
                        drag
                        dragConstraints={arenaRef}
                        dragElastic={0.15}
                        dragMomentum
                        // Drops from sky once
                        initial={{ y: -900, x: pos.x, rotate: pos.rot, opacity: 0, scale: 0.3 }}
                        animate={isInView ? {
                            // After landing, gently float up and down indefinitely
                            y: [null, 0, -pos.floatY, 0],
                            x: 0,
                            rotate: 0,
                            opacity: 1,
                            scale: 1,
                        } : {}}
                        transition={{
                            // Fall phase
                            type: 'spring',
                            stiffness: 50,
                            damping: 10,
                            bounce: 0.6,
                            delay: i * 0.07,
                            // Float phase (kicks in after landing)
                            y: {
                                type: 'spring',
                                stiffness: 50,
                                damping: 10,
                                bounce: 0.6,
                                delay: i * 0.07,
                                // Continuous after landing
                                repeat: Infinity,
                                repeatType: 'mirror',
                                duration: pos.floatDuration,
                                repeatDelay: pos.floatDelay,
                                ease: 'easeInOut',
                            },
                        }}
                        whileHover={{ scale: 1.18 }}
                        whileTap={{ scale: 0.9 }}
                        className="relative cursor-grab active:cursor-grabbing select-none z-10 flex items-center justify-center"
                        style={{ width: '8rem', height: '8rem' }}
                    >
                        {/* 3D Sphere Shell */}
                        <div
                            className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
                            style={{
                                background: color.bg,
                                boxShadow: `0 20px 50px ${color.shadow}, inset 0 -8px 20px rgba(0,0,0,0.3)`,
                            }}
                        >
                            {/* Specular Highlight */}
                            <div
                                className="absolute top-[12%] left-[20%] w-[35%] h-[28%] rounded-full pointer-events-none"
                                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.0) 100%)' }}
                            />
                            {/* Secondary rim light */}
                            <div
                                className="absolute bottom-[10%] right-[10%] w-[20%] h-[20%] rounded-full pointer-events-none"
                                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 100%)' }}
                            />

                            {/* Label */}
                            <span className="relative z-10 text-white font-bold text-xs md:text-sm text-center leading-tight px-3 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                                {skill}
                            </span>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

// Prominent Floating Theme Widget
function FloatingThemeToggle({ isLight, onToggle }: { isLight: boolean, onToggle: () => void }) {
    return (
        <motion.button
            whileHover={{ scale: 1.15, rotate: isLight ? 15 : -15 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggle}
            title={`Switch to ${isLight ? 'Dark Mode' : 'Light Mode'}`}
            className={`fixed bottom-8 left-8 p-4 rounded-full shadow-2xl z-[9000] cursor-pointer border transition-colors duration-700 ${isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0a0b14] border-white/20 text-yellow-400 hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] backdrop-blur-lg'}`}
        >
            {isLight ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
        </motion.button>
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
        x.set(event.clientX - rect.left - rect.width / 2);
        y.set(event.clientY - rect.top - rect.height / 2);
    };

    const handleMouseLeave = () => { x.set(0); y.set(0); };

    return (
        <div style={{ perspective: 1200 }} className="w-full h-full flex justify-center items-center">
            <motion.div
                ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                whileHover={{ scale: 1.02, z: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`relative w-full rounded-[2rem] border overflow-hidden flex flex-col shadow-xl transition-all hover:shadow-2xl ${isLight ? 'bg-white border-slate-200' : 'bg-[#18181B] border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.15)]'}`}
            >
                <div className={`w-full h-64 md:h-72 overflow-hidden border-b shrink-0 relative group ${isLight ? 'border-slate-100 bg-slate-50' : 'border-white/10 bg-black/50'}`}>
                    {proj.link && !proj.image_url ? (
                        <>
                            <div className="absolute top-0 left-0 w-[400%] h-[400%] origin-top-left pointer-events-none transition-transform duration-1000 group-hover:scale-[0.27] z-0 scale-[0.25]">
                                <iframe src={proj.link} className="w-full h-full border-none opacity-80 group-hover:opacity-100 transition-opacity duration-700" title={proj.title} sandbox="allow-scripts allow-same-origin" />
                            </div>
                            <div className="absolute inset-0 bg-transparent z-10" />
                        </>
                    ) : proj.image_url ? (
                        <img src={proj.image_url} alt={proj.title} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!isLight && 'opacity-80 group-hover:opacity-100 mix-blend-screen'}`} />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center text-sm font-bold uppercase tracking-widest ${isLight ? 'text-slate-300' : 'text-white/20'}`}>No Preview</div>
                    )}
                </div>

                <div className="p-8 md:p-10 flex flex-col flex-1 relative z-10">
                    <h3 className={`text-3xl font-bold font-heading mb-4 tracking-tight ${isLight ? 'text-[#18181B]' : 'text-white'}`}>{proj.title}</h3>
                    <p className={`leading-relaxed mb-6 flex-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{proj.description}</p>

                    <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                        {proj.tags?.map((tag: string, tIdx: number) => (
                            <span key={tIdx} className={`px-4 py-1.5 text-xs font-bold border rounded-full tracking-wide ${isLight ? 'border-slate-200 bg-slate-50 text-slate-800' : 'border-white/10 bg-white/5 text-purple-200'}`}>{tag}</span>
                        ))}
                    </div>

                    <div className={`flex items-center gap-6 pt-6 border-t ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
                        {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full border transition-all ${isLight ? 'text-white bg-[#18181B] border-transparent hover:bg-black' : 'text-white bg-white/10 hover:bg-white/20 border-white/20'}`}>
                                <ExternalLink className="w-4 h-4" /> Live Demo
                            </a>
                        )}
                        {proj.github_link && (
                            <a href={proj.github_link} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm font-bold transition-all ${isLight ? 'text-slate-500 hover:text-black' : 'text-slate-400 hover:text-white'}`}>
                                GitHub <ExternalLink className="w-3 h-3 opacity-50" />
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export function DirectorsCut() {
    const { name, role, summary, skills, projects, experience, socials, avatar_url, logo_url, achievements, theme, updateField } = useResumeStore();

    const isLight = theme === 'minimalist';
    const email = socials?.find(s => s.platform.toLowerCase().includes('email'))?.link?.replace('mailto:', '') || '';
    const displayedSkills = skills && skills.length > 0 ? skills : ['React', 'Node.js', 'JavaScript', 'TypeScript', 'Tailwind', 'MongoDB', 'Python', 'Git'];

    return (
        <div className={`w-full h-full overflow-y-auto overflow-x-hidden relative font-body custom-scrollbar transition-colors duration-700 ${isLight ? 'bg-white text-[#18181B]' : 'bg-[#18181B] text-white'}`}>

            <FloatingThemeToggle isLight={isLight} onToggle={() => updateField('theme', isLight ? 'cyberpunk' : 'minimalist')} />

            {/* Navbar — mix-blend so it sits cleanly over the image */}
            <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between py-8 px-8 md:px-16 pointer-events-auto mix-blend-difference text-white">
                <div className="font-bold tracking-widest uppercase text-sm">
                    {logo_url ? <img src={logo_url} alt={name} className="h-6 w-auto object-contain filter invert" /> : (name || 'Portfolio')}
                </div>
                <ul className="hidden md:flex items-center gap-12 text-sm font-medium tracking-wide">
                    <li><a href="#about" className="hover:opacity-70 transition-opacity">Home</a></li>
                    <li><a href="#projects" className="hover:opacity-70 transition-opacity">Works</a></li>
                    <li><a href="#skills" className="hover:opacity-70 transition-opacity">Specialties</a></li>
                    <li><a href="#experience" className="hover:opacity-70 transition-opacity">Journey</a></li>
                </ul>
            </nav>

            {/* 50/50 Hero */}
            <section id="about" className={`min-h-screen flex flex-col md:flex-row w-full transition-colors duration-700 ${isLight ? 'bg-slate-50' : 'bg-[#18181B]'}`}>

                {/* Left: Giant Image Block */}
                <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative overflow-hidden group">
                    {avatar_url ? (
                        <motion.img
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            src={avatar_url}
                            alt={name}
                            className={`w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105 pointer-events-none ${!isLight && 'grayscale contrast-125'}`}
                        />
                    ) : (
                        <div className={`w-full h-full flex flex-col items-center justify-center text-center p-12 ${isLight ? 'bg-slate-100' : 'bg-white/5'}`}>
                            <svg className={`w-16 h-16 mb-4 ${isLight ? 'text-slate-300' : 'text-white/20'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <p className={`font-bold tracking-widest uppercase text-xs ${isLight ? 'text-slate-400' : 'text-white/20'}`}>Upload your photo in the editor</p>
                        </div>
                    )}
                </div>

                {/* Right: Giant Typography Block */}
                <div className="w-full md:w-1/2 min-h-[50vh] md:h-screen flex flex-col justify-center px-10 md:px-16 lg:px-24 py-16 relative pointer-events-auto overflow-hidden">
                    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                        <div className={`flex items-center gap-5 mb-8 text-xs tracking-widest uppercase font-bold ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                            {role || 'Full Stack Developer'}
                            <div className={`h-[1px] flex-1 max-w-[80px] ${isLight ? 'bg-slate-300' : 'bg-slate-600'}`} />
                        </div>

                        <h1 className={`font-bold font-heading leading-[1.0] tracking-tight mb-10 transition-colors duration-700 ${isLight ? 'text-[#18181B]' : 'text-white'}`}
                            style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}>
                            My<br />Portfolio
                        </h1>

                        <p className={`text-base md:text-lg leading-relaxed max-w-md mb-12 transition-colors duration-700 font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                            {summary || 'A highly motivated creator crafting modern digital experiences. Proficient in delivering aesthetic systems and interactive layouts.'}
                        </p>

                        <div className="flex flex-wrap items-center gap-6">
                            <a href="#projects" className={`px-10 py-4 font-bold text-xs tracking-widest uppercase transition-all shadow-xl hover:scale-105 ${isLight ? 'bg-[#18181B] text-white hover:bg-black' : 'bg-white text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]'}`}>
                                Explore Now
                            </a>
                            {email && (
                                <a href={`mailto:${email}`} className={`flex items-center gap-3 font-bold text-xs tracking-widest uppercase transition-colors ${isLight ? 'text-[#18181B] hover:text-slate-500' : 'text-white hover:text-slate-300'}`}>
                                    <PlayCircle className="w-5 h-5" /> Mail Me
                                </a>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 3D Glossy Sphere Skills Section */}
            <section id="skills" className={`py-28 px-8 w-full transition-colors duration-700 ${isLight ? 'bg-white' : 'bg-[#18181B]'}`}>
                <div className="max-w-[1400px] mx-auto text-center pointer-events-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className={`text-5xl md:text-6xl font-heading font-black tracking-tight mb-4 transition-colors ${isLight ? 'text-[#18181B]' : 'text-white'}`}
                    >
                        My Tech Stack
                    </motion.h2>
                    <p className={`text-base mb-14 font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        They drop once, float, and you can drag them around.
                    </p>
                    <SkillsArena skills={displayedSkills} isLight={isLight} />
                </div>
            </section>

            {/* Selected Work */}
            <section id="projects" className={`py-28 px-8 md:px-16 pointer-events-auto relative z-10 w-full max-w-[1600px] mx-auto transition-colors duration-700`}>
                <h2 className={`text-5xl md:text-6xl font-heading font-black tracking-tight mb-20 text-center transition-colors duration-700 ${isLight ? 'text-[#18181B]' : 'text-white'}`}>Selected Works</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {projects.map((proj) => (
                        <ProjectCard3D key={proj.id} proj={proj} isLight={isLight} />
                    ))}
                </div>
            </section>

            {/* Experience Timeline */}
            {experience && experience.length > 0 && (
                <section id="experience" className={`py-28 px-4 md:px-16 w-full max-w-[1200px] mx-auto relative z-10 pointer-events-auto`}>
                    <h2 className={`text-4xl md:text-5xl font-heading font-black tracking-tight mb-16 text-center ${isLight ? 'text-[#18181B]' : 'text-white'}`}>Career Journey</h2>
                    <div className={`relative border-l-2 ml-4 md:ml-16 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                        {experience.map((exp, idx) => (
                            <motion.div key={exp.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="mb-16 pl-10 relative group">
                                <div className={`absolute -left-[11px] top-1.5 w-5 h-5 rounded-full transition-all duration-700 group-hover:scale-125 ${isLight ? 'bg-[#18181B] shadow-[0_0_0_5px_white]' : 'bg-cyan-500 shadow-[0_0_15px_cyan] shadow-[0_0_0_5px_#18181B]'}`} />
                                <h3 className={`text-3xl font-bold font-heading mb-2 ${isLight ? 'text-[#18181B]' : 'text-white group-hover:text-cyan-400'}`}>{exp.role}</h3>
                                <div className={`flex flex-wrap items-center gap-4 text-sm font-bold uppercase tracking-widest mb-6 ${isLight ? 'text-slate-500' : 'text-cyan-400'}`}>
                                    <span>{exp.company}</span>
                                    <span className="hidden md:inline">•</span>
                                    <span className={`px-4 py-1.5 rounded-full border text-xs ${isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-white/50'}`}>{exp.date}</span>
                                </div>
                                <p className={`leading-relaxed max-w-3xl text-lg font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{exp.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Achievements Showcase */}
            {achievements && achievements.length > 0 && (
                <section id="achievements" className={`py-28 px-8 md:px-16 w-full max-w-[1600px] mx-auto border-t relative z-10 pointer-events-auto transition-colors duration-700 ${isLight ? 'border-slate-100 bg-slate-50' : 'border-white/10 bg-[#18181B]'}`}>
                    <h2 className={`text-4xl md:text-5xl font-heading font-black tracking-tight mb-16 text-center ${isLight ? 'text-[#18181B]' : 'text-white'}`}>Awards & Achievements</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {achievements.map((ach, idx) => (
                            <motion.div key={ach.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className={`p-10 rounded-[2rem] border transition-all group hover:-translate-y-2 ${isLight ? 'bg-white border-slate-200 shadow-xl hover:shadow-2xl' : 'bg-white/5 border-white/10 hover:border-cyan-500/50 hover:bg-white/10'}`}>
                                <div className={`text-xs font-bold tracking-widest uppercase mb-6 px-4 py-1.5 inline-block rounded-full border ${isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-white/10 text-white border-white/20'}`}>{ach.date}</div>
                                <h3 className={`text-2xl font-bold font-heading mb-4 ${isLight ? 'text-[#18181B]' : 'text-white'}`}>{ach.title}</h3>
                                <div className={`text-sm font-bold uppercase tracking-widest mb-6 ${isLight ? 'text-slate-500' : 'text-cyan-400'}`}>{ach.event}</div>
                                <p className={`leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{ach.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
}
