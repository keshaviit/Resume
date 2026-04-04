import { useResumeStore } from '../../store/useResumeStore';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ExternalLink, Moon, Sun, PlayCircle } from 'lucide-react';
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
            title={`Switch to ${isLight ? 'Dark Mode' : 'Light Mode'}`}
            className={`fixed bottom-8 left-8 p-4 rounded-full shadow-2xl z-[9000] cursor-none border transition-colors duration-700 ${isLight ? 'bg-white border-slate-200 text-slate-800 hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)]' : 'bg-[#0a0b14] border-white/20 text-yellow-400 hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] backdrop-blur-lg'}`}
        >
            {isLight ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
        </motion.button>
    )
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
                className={`relative w-full rounded-[2rem] border overflow-hidden flex flex-col shadow-xl transition-all hover:shadow-2xl ${isLight ? 'bg-white border-slate-200' : 'bg-[#18181B] border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.15)]'}`}
            >
                <div style={{ transform: "translateZ(30px)" }} className={`w-full h-64 md:h-72 overflow-hidden border-b shrink-0 relative group ${isLight ? 'border-slate-100 bg-slate-50' : 'border-white/10 bg-black/50'}`}>
                    {proj.link && !proj.image_url ? (
                        <>
                            <div className={`absolute top-0 left-0 w-[400%] h-[400%] origin-top-left pointer-events-none transition-transform duration-1000 group-hover:scale-[0.27] z-0 scale-[0.25]`}>
                                <iframe src={proj.link} className="w-full h-full border-none opacity-80 group-hover:opacity-100 transition-opacity duration-700" title={proj.title} sandbox="allow-scripts allow-same-origin"/>
                            </div>
                            <div className="absolute inset-0 bg-transparent z-10" />
                        </>
                    ) : proj.image_url ? (
                        <img src={proj.image_url} alt={proj.title} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!isLight && 'opacity-80 group-hover:opacity-100 mix-blend-screen'}`} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-10">No Preview Found</div>
                    )}
                </div>
                
                <div style={{ transform: "translateZ(40px)" }} className="p-8 md:p-10 flex flex-col flex-1 relative z-10 pointer-events-auto">
                    <h3 className={`text-3xl font-bold font-heading mb-4 tracking-tight ${isLight ? 'text-[#18181B]' : 'text-white'}`}>{proj.title}</h3>
                    <p className={`leading-relaxed mb-6 flex-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{proj.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                        {proj.tags?.map((tag: string, tIdx: number) => (
                            <span key={tIdx} className={`px-4 py-1.5 text-xs font-bold border rounded-full tracking-wide ${isLight ? 'border-slate-200 bg-slate-50 text-slate-800' : 'border-white/10 bg-white/5 text-purple-200'}`}>
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className={`flex items-center gap-6 mt-4 pt-6 border-t ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
                        {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm font-bold group/link px-5 py-2.5 rounded-full transition-all shadow-md group border cursor-none ${isLight ? 'text-white bg-[#18181B] hover:bg-black border-transparent' : 'text-white bg-white/10 hover:bg-white/20 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]'}`}>
                                <ExternalLink className="w-4 h-4" /> Live Demo
                            </a>
                        )}
                        {proj.github_link && (
                            <a href={proj.github_link} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm font-bold transition-all cursor-none ${isLight ? 'text-slate-500 hover:text-black' : 'text-slate-400 hover:text-white'}`}>
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

    // Derived properties
    const isLight = theme === 'minimalist';
    const email = socials?.find(s => s.platform.toLowerCase().includes('email'))?.link?.replace('mailto:', '') || '';
    
    // Derived properties
    const displayedSkillsBox = skills && skills.length > 0 ? skills : ['React', 'Framer Motion', 'Tailwind', 'JavaScript', 'TypeScript', 'Node.js'];
    const constraintsRef = useRef<HTMLDivElement>(null);

    return (
        <div className={`w-full h-full overflow-y-auto overflow-x-hidden relative font-body custom-scrollbar transition-colors duration-700 cursor-none ${isLight ? 'bg-white text-[#18181B]' : 'bg-[#18181B] text-white'}`}>
            
            <TrailingCursor />
            <FloatingThemeToggle isLight={isLight} onToggle={() => updateField('theme', isLight ? 'cyberpunk' : 'minimalist')} />

            {/* Absolute Navbar matching screenshot 3 perfectly */}
            <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between py-8 px-8 md:px-16 pointer-events-auto mix-blend-difference text-white">
                <div className="font-bold tracking-widest uppercase text-sm cursor-none">
                    {logo_url ? <img src={logo_url} alt={name} className="h-6 w-auto object-contain filter invert" /> : name || "JANE DOE"}
                </div>
                
                <ul className="hidden md:flex items-center gap-12 text-sm font-medium tracking-wide">
                    <li><a href="#about" className="hover:opacity-70 transition-opacity cursor-none">Home</a></li>
                    <li><a href="#projects" className="hover:opacity-70 transition-opacity cursor-none">Works</a></li>
                    <li><a href="#skills" className="hover:opacity-70 transition-opacity cursor-none">Specialties</a></li>
                    <li><a href="#experience" className="hover:opacity-70 transition-opacity cursor-none">Journey</a></li>
                </ul>
            </nav>

            {/* Huge 50/50 Editorial Hero based on Screenshot 3 */}
            <section id="about" className={`min-h-screen flex flex-col md:flex-row w-full transition-colors duration-700 ${isLight ? 'bg-slate-50' : 'bg-[#18181B]'}`}>
                
                {/* Left: Giant Image Block */}
                <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative border-r border-black/5 dark:border-white/5 overflow-hidden group">
                    {avatar_url ? (
                        <motion.img 
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            src={avatar_url} 
                            alt={name} 
                            className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 pointer-events-none ${!isLight && 'grayscale contrast-125'}`}
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-200 dark:bg-white/5 flex flex-col items-center justify-center text-center p-8 animate-pulse">
                            <div className="w-32 h-32 mb-6 rounded-full bg-slate-300 dark:bg-white/10 flex items-center justify-center">
                                <svg className="w-12 h-12 text-slate-400 dark:text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className={`font-bold tracking-widest uppercase text-sm ${isLight ? 'text-slate-400' : 'text-white/30'}`}>Upload your photo</p>
                            <p className="text-xs text-slate-400 mt-2">Use the editor dashboard.</p>
                        </div>
                    )}
                </div>

                {/* Right: Giant Typography Block */}
                <div className="w-full md:w-1/2 min-h-[50vh] md:h-screen flex flex-col justify-center px-12 md:px-24 py-16 relative pointer-events-auto">
                    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                        <div className="flex items-center gap-6 mb-8 text-sm tracking-widest uppercase font-bold text-slate-500 dark:text-slate-400">
                            {role || "UX/UI Designer"} 
                            <div className={`h-[1px] w-24 ${isLight ? 'bg-slate-300' : 'bg-slate-600'}`}></div>
                        </div>

                        <h1 className={`text-6xl md:text-[5rem] lg:text-[7rem] font-bold font-heading leading-[1.05] tracking-tight mb-10 transition-colors duration-700 ${isLight ? 'text-[#18181B]' : 'text-white'}`}>
                            My <br /> Portfolio
                        </h1>

                        <p className={`text-lg md:text-xl leading-relaxed max-w-lg mb-12 transition-colors duration-700 font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                            {summary || "A highly motivated creator crafting modern digital experiences. Proficient in delivering aesthetic systems and interactive layouts that prioritize user engagement."}
                        </p>

                        <div className="flex flex-wrap items-center gap-8">
                            <a href="#projects" className={`px-10 py-4 font-bold text-sm tracking-widest uppercase transition-all shadow-xl hover:scale-105 cursor-none rounded-none ${isLight ? 'bg-[#18181B] text-white hover:shadow-2xl hover:bg-black' : 'bg-white text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]'}`}>
                                Explore Now
                            </a>
                            {email && (
                                <a href={`mailto:${email}`} className={`flex items-center gap-3 font-bold text-sm tracking-widest uppercase transition-colors cursor-none ${isLight ? 'text-[#18181B] hover:text-slate-500' : 'text-white hover:text-slate-300'}`}>
                                    <PlayCircle className="w-6 h-6" /> Mail Me
                                </a>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Falling Ball Physics Loop — The 'Skills Arena' */}
            <section id="skills" className={`py-32 px-8 w-full transition-colors duration-700 ${isLight ? 'bg-white' : 'bg-[#18181B]'}`}>
                <div className="max-w-[1400px] mx-auto text-center pointer-events-auto">
                    <h2 className={`text-5xl md:text-6xl font-heading font-black tracking-tight mb-6 transition-colors ${isLight ? 'text-[#18181B]' : 'text-white'}`}>Technologies Box</h2>
                    <p className={`text-lg mb-16 font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Drag and throw them around.</p>
                    
                    {/* The Constraint Arena */}
                    <div ref={constraintsRef} className={`relative w-full h-[600px] rounded-[3rem] overflow-hidden flex flex-wrap justify-center items-end p-8 gap-4 border-2 shadow-inner transition-colors duration-700 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0f0f13] border-white/5'}`}>
                        {displayedSkillsBox.map((skill, i) => (
                            <motion.div
                                key={i}
                                drag
                                dragConstraints={constraintsRef}
                                dragElastic={0.4}
                                initial={{ y: -800, x: (Math.random() - 0.5) * 400, rotate: Math.random() * 90 }}
                                whileInView={{ y: 0, x: 0, rotate: 0 }}
                                viewport={{ once: true, margin: "0px" }}
                                transition={{ type: "spring", bounce: 0.6, stiffness: 60, delay: i * 0.1 }}
                                className={`w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center text-center font-bold text-sm md:text-lg shadow-xl cursor-grab active:cursor-grabbing hover:scale-105 transition-colors duration-700 select-none ${isLight ? 'bg-white text-[#1C2A31] border border-slate-200' : 'bg-gradient-to-br from-cyan-900/30 to-purple-900/30 backdrop-blur-xl border border-white/20 text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]'}`}
                            >
                                {skill}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Selected Work */}
            <section id="projects" className={`py-32 px-8 md:px-16 pointer-events-auto relative z-10 w-full max-w-[1600px] mx-auto transition-colors duration-700 ${isLight ? 'bg-white' : 'bg-[#18181B]'}`}>
                <h2 className={`text-5xl md:text-6xl font-heading font-black tracking-tight mb-20 text-center transition-colors duration-700 ${isLight ? 'text-[#18181B]' : 'text-white'}`}>Selected Works</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {projects.map((proj) => (
                        <ProjectCard3D key={proj.id} proj={proj} isLight={isLight} />
                    ))}
                </div>
            </section>

            {/* Experience Timeline */}
            {experience && experience.length > 0 && (
                <section id="experience" className={`py-32 px-4 md:px-16 w-full max-w-[1200px] mx-auto relative z-10 pointer-events-auto transition-colors duration-700`}>
                    <h2 className={`text-4xl md:text-5xl font-heading font-black tracking-tight mb-16 text-center transition-colors duration-700 ${isLight ? 'text-[#18181B]' : 'text-white'}`}>Career Journey</h2>
                    <div className={`relative border-l-2 ml-4 md:ml-16 transition-colors duration-700 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                        {experience.map((exp, idx) => (
                            <motion.div key={exp.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="mb-16 pl-10 relative group cursor-none">
                                <div className={`absolute -left-[11px] top-1.5 w-5 h-5 rounded-full transition-all duration-700 group-hover:scale-125 ${isLight ? 'bg-[#18181B] shadow-[0_0_0_5px_white]' : 'bg-cyan-500 shadow-[0_0_15px_cyan] shadow-[0_0_0_5px_#18181B]'}`} />
                                <h3 className={`text-3xl font-bold font-heading mb-2 transition-colors ${isLight ? 'text-[#18181B]' : 'text-white group-hover:text-cyan-400'}`}>{exp.role}</h3>
                                <div className={`flex flex-wrap items-center gap-4 text-sm font-bold uppercase tracking-widest mb-6 transition-colors ${isLight ? 'text-slate-500' : 'text-cyan-400'}`}>
                                    <span>{exp.company}</span>
                                    <span className="hidden md:inline">•</span>
                                    <span className={`px-4 py-1.5 rounded-full border text-xs transition-colors ${isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-white/50'}`}>{exp.date}</span>
                                </div>
                                <p className={`leading-relaxed max-w-3xl text-lg transition-colors font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{exp.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Achievements Showcase */}
            {achievements && achievements.length > 0 && (
                <section id="achievements" className={`py-32 px-8 md:px-16 w-full max-w-[1600px] mx-auto border-t relative z-10 pointer-events-auto transition-colors duration-700 ${isLight ? 'border-slate-100 bg-slate-50' : 'border-white/10 bg-[#18181B]'}`}>
                    <h2 className={`text-4xl md:text-5xl font-heading font-black tracking-tight mb-16 text-center transition-colors duration-700 ${isLight ? 'text-[#18181B]' : 'text-white'}`}>Awards & Achievements</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {achievements.map((ach, idx) => (
                            <motion.div key={ach.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className={`p-10 rounded-[2rem] border transition-all cursor-none group hover:-translate-y-2 ${isLight ? 'bg-white border-slate-200 shadow-xl hover:shadow-2xl' : 'bg-white/5 border-white/10 shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:border-cyan-500/50 hover:bg-white/10'}`}>
                                <div className={`text-xs font-bold tracking-widest uppercase mb-6 px-4 py-1.5 inline-block rounded-full border transition-colors ${isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-white/10 text-white border-white/20'}`}>{ach.date}</div>
                                <h3 className={`text-2xl font-bold font-heading mb-4 transition-colors ${isLight ? 'text-[#18181B]' : 'text-white'}`}>{ach.title}</h3>
                                <div className={`text-sm font-bold uppercase tracking-widest mb-6 transition-colors ${isLight ? 'text-slate-500' : 'text-cyan-400'}`}>{ach.event}</div>
                                <p className={`leading-relaxed transition-colors font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{ach.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
}
