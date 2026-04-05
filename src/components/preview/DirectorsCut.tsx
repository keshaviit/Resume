import { useResumeStore } from '../../store/useResumeStore';
import { motion, useMotionValue, useTransform, useInView } from 'framer-motion';
import { ExternalLink, Moon, Sun, PlayCircle, Globe, Mail, Link2 } from 'lucide-react';
import React, { useRef, useMemo } from 'react';

// Pre-seed positions once — never recalculate on re-render
const SEEDED_POSITIONS = Array.from({ length: 40 }, () => ({
    x: (Math.random() - 0.5) * 700,
    rot: (Math.random() - 0.5) * 180,
    floatY: 5 + Math.random() * 8, // Softer height
    floatDuration: 4.5 + Math.random() * 3, // Slower duration for eye relaxation
    floatDelay: Math.random() * 2,
}));

// --- Relaxing Pastel Sphere Palette ---
const SPHERE_COLORS = [
    { bg: 'radial-gradient(circle at 32% 28%, #e0f2f1, #80cbc4 40%, #26a69a 75%, #004d40)', shadow: 'rgba(128,203,196,0.35)' }, // Soft Teal
    { bg: 'radial-gradient(circle at 32% 28%, #e3f2fd, #90caf9 40%, #42a5f5 75%, #0d47a1)', shadow: 'rgba(144,202,249,0.35)' }, // Soft Blue
    { bg: 'radial-gradient(circle at 32% 28%, #f3e5f5, #ce93d8 40%, #ab47bc 75%, #4a148c)', shadow: 'rgba(206,147,216,0.35)' }, // Soft Purple
    { bg: 'radial-gradient(circle at 32% 28%, #fff3e0, #ffcc80 40%, #ffa726 75%, #e65100)', shadow: 'rgba(255,204,128,0.35)' }, // Soft Orange
    { bg: 'radial-gradient(circle at 32% 28%, #fce4ec, #f48fb1 40%, #ec407a 75%, #880e4f)', shadow: 'rgba(244,143,177,0.35)' }, // Soft Pink
    { bg: 'radial-gradient(circle at 32% 28%, #e8f5e9, #a5d6a7 40%, #66bb6a 75%, #1b5e20)', shadow: 'rgba(165,214,167,0.35)' }, // Soft Green
    { bg: 'radial-gradient(circle at 32% 28%, #fffde7, #fff59d 40%, #ffee58 75%, #f57f17)', shadow: 'rgba(255,245,157,0.35)' }, // Soft Yellow
    { bg: 'radial-gradient(circle at 32% 28%, #efebe9, #bcaaa4 40%, #8d6e63 75%, #3e2723)', shadow: 'rgba(188,170,164,0.35)' }, // Soft Brown
];

// SkillsArena — 3D glossy pastel spheres, fall once & float forever
function SkillsArena({ skills, isLight }: { skills: string[], isLight: boolean }) {
    const arenaRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(arenaRef, { once: true, margin: '-80px' });
    const seedPos = useMemo(() => SEEDED_POSITIONS.slice(0, skills.length), [skills.length]);

    return (
        <div
            ref={arenaRef}
            className={`relative w-full min-h-[520px] rounded-[2.5rem] overflow-hidden flex flex-wrap justify-center items-end p-8 gap-5 border-2 transition-colors duration-700 ${
                isLight
                    ? 'bg-gradient-to-b from-slate-50 to-white border-slate-100 shadow-[inset_0_2px_30px_rgba(0,0,0,0.04)]'
                    : 'bg-gradient-to-b from-[#08081a] to-[#0d0d1f] border-white/5 shadow-[inset_0_0_60px_rgba(0,0,0,0.6)]'
            }`}
        >
            {/* Atmospheric background radials */}
            <div className={`absolute inset-0 overflow-hidden pointer-events-none rounded-[2.5rem]`}>
                <div className={`absolute top-[15%] left-[10%] w-56 h-56 rounded-full blur-3xl opacity-30 ${isLight ? 'bg-green-200' : 'bg-green-900'}`} />
                <div className={`absolute top-[20%] right-[15%] w-48 h-48 rounded-full blur-3xl opacity-30 ${isLight ? 'bg-blue-200' : 'bg-blue-900'}`} />
                <div className={`absolute bottom-[15%] left-[30%] w-40 h-40 rounded-full blur-3xl opacity-25 ${isLight ? 'bg-purple-200' : 'bg-purple-900'}`} />
            </div>

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
                        initial={{ y: -900, x: pos.x, rotate: pos.rot, opacity: 0, scale: 0.3 }}
                        animate={isInView ? {
                            y: [null, 0, -pos.floatY, 0],
                            x: 0,
                            rotate: 0,
                            opacity: 1,
                            scale: 1,
                        } : {}}
                        transition={{
                            type: 'spring',
                            stiffness: 50,
                            damping: 10,
                            bounce: 0.6,
                            delay: i * 0.07,
                            y: {
                                type: 'spring',
                                stiffness: 50,
                                damping: 10,
                                bounce: 0.6,
                                delay: i * 0.07,
                                repeat: Infinity,
                                repeatType: 'mirror',
                                duration: pos.floatDuration,
                                repeatDelay: pos.floatDelay,
                            },
                        }}
                        whileHover={{ scale: 1.18 }}
                        whileTap={{ scale: 0.9 }}
                        className="relative cursor-grab active:cursor-grabbing select-none z-10"
                        style={{ width: '8rem', height: '8rem' }}
                    >
                        {/* 3D Sphere */}
                        <div
                            className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
                            style={{
                                background: color.bg,
                                boxShadow: `0 16px 45px ${color.shadow}, inset 0 -6px 18px rgba(0,0,0,0.25)`,
                            }}
                        >
                            {/* Specular Highlight */}
                            <div
                                className="absolute top-[10%] left-[18%] w-[38%] h-[30%] rounded-full pointer-events-none"
                                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)' }}
                            />
                            {/* Secondary rim light */}
                            <div
                                className="absolute bottom-[8%] right-[8%] w-[22%] h-[22%] rounded-full pointer-events-none"
                                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 100%)' }}
                            />
                            {/* Label */}
                            <span className="relative z-10 font-bold text-xs leading-tight text-center px-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] text-white">
                                {skill}
                            </span>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

// Helper: detect social platform from URL and render emoji badge + label
function getSocialIcon(platform: string, link: string) {
    const p = (platform + link).toLowerCase();
    if (p.includes('github')) return { Icon: Link2, emoji: '🐙', label: 'GitHub' };
    if (p.includes('linkedin')) return { Icon: Link2, emoji: '💼', label: 'LinkedIn' };
    if (p.includes('twitter') || p.includes('x.com')) return { Icon: Link2, emoji: '𝕏', label: 'Twitter/X' };
    if (p.includes('instagram')) return { Icon: Link2, emoji: '📷', label: 'Instagram' };
    if (p.includes('youtube')) return { Icon: Link2, emoji: '▶️', label: 'YouTube' };
    if (p.includes('mailto') || p.includes('@')) return { Icon: Mail, emoji: '✉️', label: 'Email' };
    return { Icon: Globe, emoji: '🌐', label: platform };
}

// Floating Theme Widget
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

// 3D Tilt Project Card with Vercel-style iframe preview
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
        <div style={{ perspective: 1200 }} className="w-full flex justify-center items-center">
            <motion.div
                ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                whileHover={{ scale: 1.02, z: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`relative w-full rounded-[2rem] border overflow-hidden flex flex-col shadow-xl transition-all hover:shadow-2xl ${isLight ? 'bg-white border-slate-200' : 'bg-[#18181B] border-white/10'}`}
            >
                <div className={`w-full h-64 overflow-hidden border-b shrink-0 relative group ${isLight ? 'border-slate-100 bg-slate-50' : 'border-white/10 bg-black/50'}`}>
                    {proj.link && !proj.image_url ? (
                        <>
                            <div className="absolute top-0 left-0 w-[400%] h-[400%] origin-top-left pointer-events-none transition-transform duration-1000 group-hover:scale-[0.27] scale-[0.25] z-0">
                                <iframe src={proj.link} className="w-full h-full border-none opacity-80 group-hover:opacity-100 transition-opacity duration-700" title={proj.title} sandbox="allow-scripts allow-same-origin" />
                            </div>
                            <div className="absolute inset-0 z-10" />
                        </>
                    ) : proj.image_url ? (
                        <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center text-sm font-bold uppercase tracking-widest ${isLight ? 'text-slate-300' : 'text-white/20'}`}>No Preview</div>
                    )}
                </div>
                <div className="p-8 flex flex-col flex-1">
                    <h3 className={`text-2xl font-bold font-heading mb-3 tracking-tight ${isLight ? 'text-[#18181B]' : 'text-white'}`}>{proj.title}</h3>
                    <p className={`leading-relaxed mb-6 flex-1 text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{proj.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {proj.tags?.map((tag: string, idx: number) => (
                            <span key={idx} className={`px-3 py-1 text-xs font-bold border rounded-full ${isLight ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-white/10 bg-white/5 text-purple-200'}`}>{tag}</span>
                        ))}
                    </div>
                    <div className={`flex items-center gap-4 pt-5 border-t ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
                        {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-full border transition-all ${isLight ? 'text-white bg-[#18181B] border-transparent hover:bg-black' : 'text-white bg-white/10 hover:bg-white/20 border-white/20'}`}>
                                <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                            </a>
                        )}
                        {proj.github_link && (
                            <a href={proj.github_link} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1.5 text-xs font-bold transition-all ${isLight ? 'text-slate-500 hover:text-black' : 'text-slate-400 hover:text-white'}`}>
                                <Link2 className="w-4 h-4" /> GitHub
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
    const displayedSkills = skills && skills.length > 0 ? skills : ['React', 'Node.js', 'JavaScript', 'TypeScript', 'Tailwind', 'MongoDB', 'Python', 'Git', 'Express'];

    // Only show socials that have actual links
    const activeSocials = (socials || []).filter(s => s.link && s.link.trim() !== '');

    return (
        <div className={`w-full h-full overflow-y-auto overflow-x-hidden relative font-body custom-scrollbar transition-colors duration-700 ${isLight ? 'bg-white text-[#18181B]' : 'bg-[#18181B] text-white'}`}>

            <FloatingThemeToggle isLight={isLight} onToggle={() => updateField('theme', isLight ? 'cyberpunk' : 'minimalist')} />

            {/* Navbar */}
            <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between py-7 px-8 md:px-16 pointer-events-auto mix-blend-difference text-white">
                <div className="font-bold tracking-widest uppercase text-sm">
                    {logo_url ? <img src={logo_url} alt={name} className="h-6 w-auto object-contain filter invert" /> : (name || 'Portfolio')}
                </div>
                <ul className="hidden md:flex items-center gap-10 text-xs font-semibold tracking-widest uppercase">
                    <li><a href="#about" className="hover:opacity-60 transition-opacity">Home</a></li>
                    <li><a href="#projects" className="hover:opacity-60 transition-opacity">Works</a></li>
                    <li><a href="#skills" className="hover:opacity-60 transition-opacity">Skills</a></li>
                    <li><a href="#experience" className="hover:opacity-60 transition-opacity">Journey</a></li>
                </ul>
            </nav>

            {/* === 50/50 Hero === */}
            <section id="about" className={`min-h-screen flex flex-col md:flex-row w-full transition-colors duration-700 ${isLight ? 'bg-slate-50' : 'bg-[#18181B]'}`}>

                {/* Left: Giant Image */}
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

                {/* Right: Typography + Social Icons */}
                <div className="w-full md:w-1/2 min-h-[50vh] md:h-screen flex flex-col justify-center px-10 md:px-16 lg:px-24 py-16 relative pointer-events-auto overflow-hidden">
                    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                        {/* Role badge */}
                        <div className={`flex items-center gap-4 mb-8 text-xs tracking-widest uppercase font-bold ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                            {role || 'Full Stack Developer'}
                            <div className={`h-[1px] flex-1 max-w-[60px] ${isLight ? 'bg-slate-300' : 'bg-slate-600'}`} />
                        </div>

                        {/* Giant Title */}
                        <h1
                            className={`font-bold font-heading leading-[1.0] tracking-tight mb-8 transition-colors duration-700 ${isLight ? 'text-[#18181B]' : 'text-white'}`}
                            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}
                        >
                            My<br />Portfolio
                        </h1>

                        {/* Summary */}
                        <p className={`text-base md:text-lg leading-relaxed max-w-md mb-10 transition-colors duration-700 font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                            {summary || 'A highly motivated creator crafting modern digital experiences.'}
                        </p>

                        {/* Social Media Icons Row in About Section */}
                        {activeSocials.length > 0 && (
                            <div className="flex items-center gap-3 mb-10 flex-wrap">
                                {activeSocials.map((s, idx) => {
                                    const { emoji, label } = getSocialIcon(s.platform, s.link);
                                    return (
                                        <motion.a
                                            key={idx}
                                            href={s.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.18, y: -3 }}
                                            whileTap={{ scale: 0.9 }}
                                            title={label}
                                            className={`w-11 h-11 rounded-full border flex items-center justify-center text-lg transition-all ${isLight ? 'border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-400' : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'}`}
                                        >
                                            {emoji}
                                        </motion.a>
                                    );
                                })}
                            </div>
                        )}

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-6">
                            <a href="#projects" className={`px-9 py-4 font-bold text-xs tracking-widest uppercase transition-all shadow-xl hover:scale-105 ${isLight ? 'bg-[#18181B] text-white hover:bg-black' : 'bg-white text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]'}`}>
                                Explore Now
                            </a>
                            {email && (
                                <a href={`mailto:${email}`} className={`flex items-center gap-2 font-bold text-xs tracking-widest uppercase transition-colors ${isLight ? 'text-[#18181B] hover:text-slate-500' : 'text-white hover:text-slate-300'}`}>
                                    <PlayCircle className="w-5 h-5" /> Mail Me
                                </a>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* === 3D Glossy Sphere Skills === */}
            <section id="skills" className={`py-28 px-8 w-full transition-colors duration-700 ${isLight ? 'bg-white' : 'bg-[#18181B]'}`}>
                <div className="max-w-[1400px] mx-auto text-center pointer-events-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className={`text-5xl md:text-6xl font-heading font-black tracking-tight mb-4 ${isLight ? 'text-[#18181B]' : 'text-white'}`}
                    >
                        My Tech Stack
                    </motion.h2>
                    <p className={`text-sm mb-14 font-medium tracking-wide ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                        Scroll here — they drop once & float. Drag to throw!
                    </p>
                    <SkillsArena skills={displayedSkills} isLight={isLight} />
                </div>
            </section>

            {/* === Selected Work === */}
            <section id="projects" className={`py-28 px-8 md:px-16 relative z-10 w-full max-w-[1600px] mx-auto transition-colors duration-700`}>
                <h2 className={`text-5xl md:text-6xl font-heading font-black tracking-tight mb-20 text-center ${isLight ? 'text-[#18181B]' : 'text-white'}`}>Selected Works</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {projects.map((proj) => (
                        <ProjectCard3D key={proj.id} proj={proj} isLight={isLight} />
                    ))}
                </div>
            </section>

            {/* === Experience Timeline === */}
            {experience && experience.length > 0 && (
                <section id="experience" className={`py-28 px-4 md:px-16 w-full max-w-[1200px] mx-auto relative z-10`}>
                    <h2 className={`text-4xl md:text-5xl font-heading font-black tracking-tight mb-16 text-center ${isLight ? 'text-[#18181B]' : 'text-white'}`}>Career Journey</h2>
                    <div className={`relative border-l-2 ml-4 md:ml-16 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                        {experience.map((exp, idx) => (
                            <motion.div key={exp.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="mb-16 pl-10 relative group">
                                <div className={`absolute -left-[11px] top-1.5 w-5 h-5 rounded-full group-hover:scale-125 transition-all ${isLight ? 'bg-[#18181B] shadow-[0_0_0_5px_white]' : 'bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.6)] shadow-[0_0_0_5px_#18181B]'}`} />
                                <h3 className={`text-2xl font-bold font-heading mb-2 ${isLight ? 'text-[#18181B]' : 'text-white group-hover:text-cyan-400'} transition-colors`}>{exp.role}</h3>
                                <div className={`flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest mb-5 ${isLight ? 'text-slate-500' : 'text-cyan-400'}`}>
                                    <span>{exp.company}</span>
                                    <span className={`px-3 py-1 rounded-full border text-xs ${isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-white/50'}`}>{exp.date}</span>
                                </div>
                                <p className={`leading-relaxed max-w-3xl font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{exp.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* === Achievements === */}
            {achievements && achievements.length > 0 && (
                <section id="achievements" className={`py-28 px-8 md:px-16 w-full max-w-[1600px] mx-auto border-t ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
                    <h2 className={`text-4xl md:text-5xl font-heading font-black tracking-tight mb-16 text-center ${isLight ? 'text-[#18181B]' : 'text-white'}`}>Awards & Achievements</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {achievements.map((ach, idx) => (
                            <motion.div key={ach.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className={`p-8 rounded-[2rem] border group hover:-translate-y-2 transition-all ${isLight ? 'bg-white border-slate-200 shadow-xl hover:shadow-2xl' : 'bg-white/5 border-white/10 hover:border-cyan-500/50'}`}>
                                <div className={`text-xs font-bold tracking-widest uppercase mb-6 px-3 py-1.5 inline-block rounded-full border ${isLight ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-white/10 text-white/60 border-white/20'}`}>{ach.date}</div>
                                <h3 className={`text-xl font-bold font-heading mb-3 ${isLight ? 'text-[#18181B]' : 'text-white'}`}>{ach.title}</h3>
                                <div className={`text-xs font-bold uppercase tracking-widest mb-5 ${isLight ? 'text-slate-400' : 'text-cyan-400'}`}>{ach.event}</div>
                                <p className={`leading-relaxed text-sm font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{ach.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* === Footer with Social Media === */}
            <footer className={`w-full border-t py-16 px-8 mt-10 transition-colors duration-700 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d0d14] border-white/10'}`}>
                <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                    {/* Brand */}
                    <div>
                        <div className={`text-2xl font-heading font-black tracking-tight italic mb-2 ${isLight ? 'text-[#18181B]' : 'text-white'}`}>
                            {logo_url ? <img src={logo_url} alt={name} className="h-8 w-auto object-contain" /> : (name || 'Portfolio')}
                        </div>
                        <p className={`text-xs tracking-widest uppercase font-bold ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{role || 'Developer'}</p>
                    </div>

                    {/* Social Icons */}
                    <div className="flex items-center gap-4 flex-wrap justify-center">
                        {activeSocials.map((s, idx) => {
                            const { emoji, label } = getSocialIcon(s.platform, s.link);
                            return (
                                <motion.a
                                    key={idx}
                                    href={s.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.2, y: -4 }}
                                    whileTap={{ scale: 0.9 }}
                                    title={label}
                                    className={`w-12 h-12 rounded-full border flex items-center justify-center text-xl transition-all ${isLight ? 'border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-400' : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'}`}
                                >
                                    {emoji}
                                </motion.a>
                            );
                        })}
                        {/* Always show email if no socials match */}
                        {activeSocials.length === 0 && email && (
                            <motion.a href={`mailto:${email}`} whileHover={{ scale: 1.2, y: -4 }} className={`w-12 h-12 rounded-full border flex items-center justify-center ${isLight ? 'border-slate-200 bg-white text-slate-600 shadow-sm' : 'border-white/10 bg-white/5 text-white/50'}`}>
                                <Mail className="w-5 h-5" />
                            </motion.a>
                        )}
                    </div>

                    {/* Copy */}
                    <p className={`text-xs font-medium tracking-wide ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
                        © {new Date().getFullYear()} {name || 'Portfolio'}. Built with PortfolioAI.
                    </p>
                </div>
            </footer>

        </div>
    );
}
