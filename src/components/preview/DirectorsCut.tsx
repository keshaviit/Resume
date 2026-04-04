



import { useResumeStore } from '../../store/useResumeStore';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ExternalLink, Calendar, Building2, Globe, Star } from 'lucide-react';
import React, { useRef } from 'react';

// A specialized 3D Card component
function ProjectCard3D({ proj, isTop }: { proj: any, isTop: boolean }) {
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

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div style={{ perspective: 1200 }} className="w-full h-full flex justify-center items-center">
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                whileHover={{ scale: 1.02, z: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`relative w-full rounded-3xl border overflow-hidden flex flex-col shadow-2xl transition-all ${isTop ? 'bg-gradient-to-br from-purple-900/40 via-[#0a0b14] to-cyan-900/20 border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.2)]' : 'bg-[#0a0b14]/80 border-white/10 hover:border-cyan-500/30'}`}
            >
                {/* Hero Image */}
                {proj.image_url && (
                    <div style={{ transform: "translateZ(30px)" }} className="w-full h-64 md:h-72 overflow-hidden border-b border-white/10 shrink-0">
                        <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover opacity-90 transition-opacity hover:opacity-100" />
                    </div>
                )}
                
                <div style={{ transform: "translateZ(40px)" }} className="p-8 flex flex-col flex-1 relative z-10">
                    <h3 className="text-3xl font-bold font-heading mb-4 text-white tracking-tight">{proj.title}</h3>
                    <p className="text-white/70 leading-relaxed font-light mb-6 flex-1">{proj.description}</p>
                    
                    {proj.key_features && proj.key_features.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-sm uppercase tracking-widest text-[#2222aa] font-bold mb-3 text-cyan-400">Key Features:</h4>
                            <ul className="space-y-2">
                                {proj.key_features.map((feature: string, idx: number) => (
                                    <li key={idx} className="flex items-start text-sm text-white/80">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 mr-3 shrink-0 shadow-[0_0_8px_cyan]" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                        {proj.tags?.map((tag: string, tIdx: number) => (
                            <span key={tIdx} className="px-3 py-1.5 text-xs font-semibold border border-[#1a1b30] rounded-full bg-[#101223] text-purple-200 tracking-wide">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-6 mt-4 pt-6 border-t border-white/10">
                        {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-semibold group/link p-2 bg-cyan-500/10 rounded-lg hover:bg-cyan-500/20 transition-all">
                                <ExternalLink className="w-4 h-4" /> Live Demo
                            </a>
                        )}
                        {proj.github_link && (
                            <a href={proj.github_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/60 hover:text-white font-semibold transition-all">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> GitHub
                                <ExternalLink className="w-3 h-3 opacity-50" />
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// A specialized 3D Card component for About Me
function AboutCard3D({ summary, name, avatar_url, isLight }: { summary: string, name: string, avatar_url: string, isLight: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [5, -5]);
    const rotateY = useTransform(x, [-100, 100], [-5, 5]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <section id="about" className="w-full flex justify-center items-center py-24 px-4 md:px-12 relative z-10" style={{ perspective: 1200 }}>
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.01 }}
                className={`max-w-6xl w-full relative rounded-[2rem] md:rounded-[3rem] border overflow-hidden flex flex-col md:flex-row shadow-2xl transition-all ${isLight ? 'bg-white/80 border-slate-200' : 'bg-gradient-to-br from-purple-900/20 via-[#0a0b14] to-cyan-900/10 border-purple-500/20 shadow-[0_0_50px_rgba(168,85,247,0.15)] backdrop-blur-md'}`}
            >
                {/* Image Section */}
                {avatar_url && (
                    <div style={{ transform: "translateZ(40px)" }} className={`w-full md:w-2/5 p-8 md:p-12 flex items-center justify-center ${isLight ? 'bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200' : 'bg-black/20 border-b md:border-b-0 md:border-r border-white/5'}`}>
                        <div className={`w-full aspect-square rounded-full overflow-hidden shadow-2xl relative group ${isLight ? 'border-8 border-white' : 'border border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.2)]'}`}>
                            {!isLight && <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-purple-500/20 mix-blend-overlay z-10 transition-opacity opacity-100 group-hover:opacity-0" />}
                            <img src={avatar_url} alt={name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                        </div>
                    </div>
                )}
                
                {/* Text section */}
                <div style={{ transform: "translateZ(50px)" }} className="flex-1 p-8 md:p-16 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-8">
                        <Star className={`w-10 h-10 ${isLight ? 'text-amber-400' : 'text-cyan-400'}`} />
                        <h2 className={`text-4xl md:text-5xl font-heading font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>About Me</h2>
                    </div>
                    <p className={`text-xl md:text-2xl leading-relaxed italic ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                        "{summary || 'Your impactful summary goes here...'}"
                    </p>
                </div>
            </motion.div>
        </section>
    );
}

export function DirectorsCut() {
    const { name, role, summary, skills, projects, experience, socials, avatar_url, achievements, theme } = useResumeStore();

    // Deduplicate skills to prevent React key warnings
    const uniqueSkills = [...new Set(skills)];

    // Theme logic mapping
    const isLight = theme === 'minimalist';
    const isExecutive = theme === 'executive';

    // Theme Variables
    const bgClass = isLight ? 'bg-slate-50 text-slate-800' : isExecutive ? 'bg-slate-900 text-slate-100' : 'bg-[#0a0b14] text-white';
    const navBg = isLight ? 'bg-white/80 border-slate-200' : isExecutive ? 'bg-slate-900/80 border-slate-700' : 'bg-black/50 border-white/5';

    return (
        <div className={`w-full h-full overflow-y-auto overflow-x-hidden relative font-body custom-scrollbar ${bgClass}`}>
            
            {/* Cinematic Background Layer */}
            {!isLight && (
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-[20%] right-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-purple-600/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[10%] left-[5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-cyan-600/10 rounded-full blur-[100px]" />
                </div>
            )}

            {/* Sticky Navigation Taskbar */}
            <nav className={`sticky top-0 z-50 backdrop-blur-md border-b py-4 px-12 ${navBg}`}>
                <ul className="flex items-center justify-center gap-8 text-sm font-medium text-white/60">
                    <li><a href="#hero" className="hover:text-cyan-400 transition-colors portrait:hidden">Home</a></li>
                    <li><a href="#skills" className="hover:text-cyan-400 transition-colors">Skills</a></li>
                    <li><a href="#projects" className="hover:text-purple-400 transition-colors">Projects</a></li>
                    <li><a href="#experience" className="hover:text-cyan-400 transition-colors">Experience</a></li>
                    {achievements && achievements.length > 0 && (
                        <li><a href="#achievements" className="hover:text-yellow-400 transition-colors">Achievements</a></li>
                    )}
                </ul>
            </nav>

            {/* Massive Typography Hero Section based on Mockup */}
            <section id="hero" className="min-h-screen flex flex-col px-6 md:px-16 relative overflow-hidden pt-20 pb-12 z-10">
                {/* Huge Watermark Background Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0">
                    <h1 className={`text-[20vw] md:text-[25vw] font-black tracking-tighter opacity-[0.03] ${isLight ? 'text-slate-900' : 'text-white'} whitespace-nowrap`}>
                        PORTFOLIO
                    </h1>
                </div>

                {/* Main Content Layout */}
                <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center">
                    
                    {/* Left side content wrapper */}
                    <div className="w-full md:w-1/2 flex flex-col z-20 mt-12 md:mt-0">
                        {/* Stats Row */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                            className="flex items-center gap-12 md:gap-20 mb-16"
                        >
                            <div>
                                <h3 className={`text-5xl md:text-6xl font-light mb-2 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                                    +{projects.length > 0 ? projects.length : '10'}
                                </h3>
                                <p className={`text-sm font-medium tracking-wide uppercase ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
                                    Projects Completed
                                </p>
                            </div>
                            <div>
                                <h3 className={`text-5xl md:text-6xl font-light mb-2 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                                    +{experience.length > 0 ? experience.length : '5'}
                                </h3>
                                <p className={`text-sm font-medium tracking-wide uppercase ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
                                    Years Experience
                                </p>
                            </div>
                        </motion.div>

                        {/* Hello Text block */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
                            <h2 className={`text-8xl md:text-[10rem] font-light tracking-tighter leading-none mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                Hello
                            </h2>
                            <p className={`text-xl md:text-2xl font-light flex items-center gap-4 ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                                <span className={`w-8 h-px ${isLight ? 'bg-slate-900' : 'bg-white'}`}></span> 
                                It's {name || 'You'}, a {role || 'Wizard'}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
                            className="mt-16 flex items-center space-x-6"
                        >
                            <button 
                                className={`px-8 py-4 font-semibold rounded-full transition-all hover:scale-105 active:scale-95 ${isLight ? 'bg-slate-900 text-white shadow-xl hover:shadow-2xl' : 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]'}`}
                                onClick={() => {
                                    const linkedIn = socials?.find(s => s.platform.toLowerCase() === 'linkedin');
                                    if (linkedIn && linkedIn.link) window.open(linkedIn.link, '_blank');
                                    else window.location.href = `mailto:?subject=Hello ${name}&body=I saw your portfolio and would like to connect!`;
                                }}
                            >
                                Contact Me
                            </button>
                            
                            {/* Social Icons inside Hero */}
                            {socials && socials.length > 0 && (
                                <div className="flex items-center gap-4 ml-4">
                                    {socials.map(social => {
                                        let Icon = null;
                                        const plat = social.platform.toLowerCase();
                                        if (plat.includes('linkedin')) Icon = <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>;
                                        else if (plat.includes('instagram')) Icon = <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069v-2.163zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>;
                                        else if (plat.includes('leetcode')) Icon = <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.939 5.939 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.956-.207a1.384 1.384 0 0 0-.207-1.953l-3.5-2.831c-2.226-1.799-5.366-1.374-7.337.814l-2.316 2.576H19.28c.76 0 1.376-.616 1.376-1.376 0-.76-.616-1.376-1.376-1.376H4.21l1.554-1.727L11.171 1.42c.523-.561 1.392-.583 1.942-.051l1.637 1.603a1.37 1.37 0 0 0 1.905-.035 1.378 1.378 0 0 0-.036-1.948L14.981.427A1.376 1.376 0 0 0 13.483 0zm-1.848 16.513c-.76 0-1.375.616-1.375 1.376 0 .76.616 1.376 1.375 1.376h5.836c.76 0 1.376-.616 1.376-1.376 0-.76-.616-1.376-1.376-1.376h-5.836z" /></svg>;
                                        else Icon = <Globe className="w-5 h-5" />;

                                        return (
                                            <a 
                                                key={social.id}
                                                href={social.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`p-3 rounded-full transition-all hover:scale-110 flex items-center justify-center ${isLight ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-white/5 text-white/70 hover:bg-white/20 hover:text-white'}`}
                                                title={social.platform}
                                            >
                                                {Icon}
                                            </a>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Massive bottom-anchored Avatar component matching image */}
                    {avatar_url && (
                        <div className="absolute bottom-0 right-0 md:right-1/12 lg:right-1/4 w-full md:w-[600px] h-[70vh] pointer-events-none z-10 flex items-end justify-center">
                            <motion.img 
                                initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 50 }}
                                src={avatar_url} 
                                alt={name} 
                                className={`w-full max-h-[85vh] object-contain object-bottom pointer-events-auto ${!isLight && 'drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]'}`}
                                style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))" }}
                            />
                        </div>
                    )}
                </div>

                {/* Bottom Scroll Indicator matching Image */}
                <div className={`absolute bottom-8 right-12 z-20 flex items-center gap-2 text-sm font-medium ${isLight ? 'text-slate-500' : 'text-white/40'}`}>
                    <span>Scroll down</span>
                    <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>↓</motion.div>
                </div>
                
                {/* Left side text vertical matching image */}
                <div className={`absolute left-0 bottom-24 z-20 -rotate-90 origin-bottom-left flex items-center gap-4 text-xs tracking-[0.2em] uppercase font-bold ${isLight ? 'text-slate-400' : 'text-white/30'}`}>
                    <span>{role || 'Product Designer'}</span>
                    <span className="w-8 h-px bg-current"></span>
                    <span>{new Date().getFullYear()}</span>
                </div>
            </section>

            <AboutCard3D name={name} summary={summary} avatar_url={avatar_url} isLight={isLight} />
            <section id="skills" className="px-12 py-12 border-t border-b border-white/5 bg-white/[0.01]">
                <div className="flex flex-wrap gap-3">
                    {uniqueSkills.map((skill, idx) => (
                        <motion.div
                            key={`skill-${idx}`}
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
                            className="px-5 py-2.5 rounded-full border border-white/10 bg-black/40 text-sm font-medium text-white/80 hover:border-cyan-500/50 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all cursor-default"
                        >
                            {skill}
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Selected Work — Cinematic 3D Cards */}
            <section id="projects" className="p-12 relative z-10">
                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-16 text-center">Selected Work</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
                    {projects.map((proj, i) => (
                        <ProjectCard3D key={proj.id} proj={proj} isTop={i % 2 === 0} />
                    ))}
                </div>
            </section>

            {/* Experience — Premium Timeline */}
            <section id="experience" className="px-12 py-16 border-t border-white/5 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />

                <h2 className="text-3xl font-heading font-bold mb-14 relative z-10">Experience</h2>

                <div className="relative z-10 space-y-0">
                    {/* Vertical glowing line */}
                    <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 via-cyan-500 to-transparent" />

                    {experience.map((exp, i) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className="relative pl-20 pb-14 group last:pb-0"
                        >
                            {/* Timeline dot */}
                            <div className={`absolute left-[22px] top-1 w-[14px] h-[14px] rounded-full border-[3px] shadow-[0_0_12px_rgba(168,85,247,0.6)] group-hover:scale-125 transition-transform z-10 ${isLight ? 'bg-cyan-500 border-white' : 'border-[#050505] bg-gradient-to-br from-purple-500 to-cyan-500'}`} />

                            {/* Card */}
                            <div className={`rounded-2xl border p-7 group-hover:border-purple-500/30 transition-all duration-300 relative overflow-hidden ${isLight ? 'bg-white border-slate-200 group-hover:bg-slate-50 shadow-sm' : 'bg-white/[0.03] border-white/10 group-hover:bg-white/[0.05]'}`}>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                                        <h4 className="font-bold text-xl font-heading text-white group-hover:text-cyan-50 transition-colors">{exp.role}</h4>
                                        <div className="flex items-center gap-1.5 text-sm font-medium text-cyan-400 shrink-0">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {exp.date}
                                        </div>
                                    </div>

                                    <div className={`flex items-center gap-1.5 font-medium mb-5 ${isLight ? 'text-purple-600' : 'text-purple-300'}`}>
                                        <Building2 className="w-4 h-4" />
                                        {exp.company}
                                    </div>

                                    <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/60'}`}>{exp.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
            {/* Achievements Section */}
            {achievements && achievements.length > 0 && (
                <section id="achievements" className="px-12 py-16 border-t border-white/5 relative">
                    <h2 className="text-3xl font-heading font-bold mb-10 relative z-10 text-yellow-400">Achievements</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                        {achievements.map((ach, i) => (
                            <motion.div
                                key={ach.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-8 relative overflow-hidden group hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all"
                            >
                                <h3 className="text-2xl font-bold font-heading text-white group-hover:text-yellow-300 transition-colors mb-2">{ach.title}</h3>
                                <div className="text-yellow-500/70 text-xs uppercase tracking-widest font-medium mb-4 flex justify-between items-center bg-black/20 p-2 rounded-lg">
                                    <span>{ach.event}</span>
                                    <span>{ach.date}</span>
                                </div>
                                <p className="text-white/70 text-sm leading-relaxed mb-6">{ach.description}</p>
                                {ach.link && (
                                    <a href={ach.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-yellow-400 hover:text-yellow-300 transition-colors mt-auto">
                                        View Credential <ExternalLink className="w-3 h-3 ml-1" />
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
