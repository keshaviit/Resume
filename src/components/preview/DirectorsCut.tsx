import { useResumeStore } from '../../store/useResumeStore';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ExternalLink, Phone, Monitor, Smartphone, Layout } from 'lucide-react';
import React, { useRef } from 'react';

// A specialized 3D Card component for Projects
function ProjectCard3D({ proj }: { proj: any }) {
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

    const handleMouseLeave = () => { x.set(0); y.set(0); };

    return (
        <div style={{ perspective: 1200 }} className="w-full h-full flex justify-center items-center">
            <motion.div
                ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                whileHover={{ scale: 1.02, z: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative w-full rounded-[2rem] border overflow-hidden flex flex-col shadow-xl transition-all bg-white border-slate-200 hover:shadow-2xl"
            >
                {proj.image_url && (
                    <div style={{ transform: "translateZ(30px)" }} className="w-full h-64 md:h-72 overflow-hidden border-b border-slate-100 shrink-0 bg-slate-50 relative group">
                        <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                )}
                
                <div style={{ transform: "translateZ(40px)" }} className="p-8 md:p-10 flex flex-col flex-1 relative z-10">
                    <h3 className="text-3xl font-bold font-heading mb-4 text-[#1C2A31] tracking-tight">{proj.title}</h3>
                    <p className="text-slate-600 leading-relaxed mb-6 flex-1">{proj.description}</p>
                    
                    {proj.key_features && proj.key_features.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-xs uppercase tracking-widest text-[#215E63] font-bold mb-3">Key Features:</h4>
                            <ul className="space-y-2">
                                {proj.key_features.map((feature: string, idx: number) => (
                                    <li key={idx} className="flex items-start text-sm text-slate-600 font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#D46B55] mt-1.5 mr-3 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                        {proj.tags?.map((tag: string, tIdx: number) => (
                            <span key={tIdx} className="px-4 py-1.5 text-xs font-bold border border-slate-200 rounded-full bg-slate-50 text-slate-600 tracking-wide">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-6 mt-4 pt-6 border-t border-slate-100">
                        {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white font-bold group/link px-5 py-2.5 bg-[#1C2A31] rounded-full hover:bg-slate-800 transition-all shadow-md">
                                <ExternalLink className="w-4 h-4" /> Live Demo
                            </a>
                        )}
                        {proj.github_link && (
                            <a href={proj.github_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#1C2A31] font-bold transition-all">
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

export function DirectorsCut() {
    const { name, role, summary, skills, projects, experience, socials, avatar_url } = useResumeStore();

    // Derived properties
    const firstName = name ? name.split(' ')[0] : 'Binjan';
    const email = socials?.find(s => s.platform.toLowerCase().includes('email'))?.link?.replace('mailto:', '') || `${firstName.toLowerCase()}@gmail.com`;
    const phone = socials?.find(s => s.platform.toLowerCase().includes('phone'))?.link || '+001 (313) 345 678';
    const totalExperience = experience.length > 0 ? experience.length * 2 : 10; // dummy multiplier or real calc
    
    // Skill card setup
    const defaultIcons = [Monitor, Smartphone, Layout];
    const defaultColors = ['bg-[#1F6E65]', 'bg-[#F9C34A]', 'bg-[#F26A5A]'];
    const displayedSkills = skills.length >= 3 ? skills.slice(0, 3) : ['Website Design', 'Mobile App Design', 'Brand Identity'];

    return (
        <div className="w-full h-full overflow-y-auto overflow-x-hidden relative font-body custom-scrollbar text-[#1C2A31] bg-white">
            
            {/* Hero Layer */}
            <div className="bg-[#FAF9F6] pb-24 border-b border-slate-200">
                
                {/* Navbar matching Image */}
                <nav className="flex items-center justify-between py-8 px-8 md:px-16 w-full max-w-[1600px] mx-auto z-50 relative">
                    <div className="text-3xl font-heading font-black tracking-tighter italic text-[#1C2A31]">
                        {name || 'Binjan'}
                    </div>
                    
                    <ul className="hidden lg:flex items-center gap-12 text-xs font-black tracking-widest text-slate-500 uppercase">
                        <li><a href="#skills" className="hover:text-[#215E63] text-[#215E63] flex items-center gap-3"><span className="w-3 h-[1px] bg-[#215E63]"></span> SERVICES <span className="w-3 h-[1px] bg-[#215E63]"></span></a></li>
                        <li><a href="#projects" className="hover:text-[#215E63] transition-colors">WORKS</a></li>
                        <li><a href="#about" className="hover:text-[#215E63] transition-colors">NOTES</a></li>
                        <li><a href="#experience" className="hover:text-[#215E63] transition-colors">EXPERIENCE</a></li>
                    </ul>

                    <div className="flex items-center gap-4 text-xs font-black tracking-wider">
                        <span className="hidden md:inline">{phone}</span>
                        <a href={`tel:${phone}`} className="flex items-center justify-center p-3 rounded-full bg-white shadow-sm border border-slate-100 hover:scale-105 transition-transform text-[#215E63]">
                            <Phone className="w-4 h-4" />
                        </a>
                    </div>
                </nav>

                {/* Hero Content Grid */}
                <section id="hero" className="w-full max-w-[1600px] mx-auto px-8 md:px-16 relative min-h-[70vh] flex flex-col md:flex-row items-center justify-between mt-12 z-10">
                    
                    {/* Left Typography */}
                    <div className="w-full md:w-1/3 flex flex-col z-20 text-center md:text-left">
                        <motion.h1 
                            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
                            className="text-6xl md:text-7xl lg:text-[5.5rem] font-bold font-heading leading-[1.1] tracking-tight mb-20 text-[#1C2A31]"
                        >
                            Hey There, <br /> I'm {firstName}
                        </motion.h1>

                        <motion.a 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                            href={`mailto:${email}`}
                            className="text-[#D46B55] font-bold text-lg mb-20 hover:underlin decoration-2 underline-offset-4"
                        >
                            {email}
                        </motion.a>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex items-center gap-4 justify-center md:justify-start">
                            <span className="text-6xl md:text-7xl font-bold font-heading text-[#1C2A31]">{totalExperience}</span>
                            <div className="flex flex-col text-sm font-black tracking-widest text-slate-500 uppercase leading-snug">
                                <span>YEARS</span>
                                <span>EXPERIENCE</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Middle Artistic Image */}
                    <div className="w-full md:w-1/3 relative h-[500px] md:h-[600px] flex justify-center items-center my-12 md:my-0 z-10">
                        {/* Blob SVG Background */}
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0, rotate: -15 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ duration: 1, type: "spring" }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[600px] text-[#215E63] opacity-90 drop-shadow-lg">
                                <path fill="currentColor" transform="translate(100 100) scale(1.1) rotate(15)" d="M51.7,-64.1C65.5,-51.7,73.8,-32.1,75.9,-12.3C78,7.5,74.1,27.5,62.8,42.7C51.5,57.9,32.9,68.4,12.7,71.2C-7.4,74.1,-29.2,69.4,-44.6,56.7C-60,43.9,-69,23.3,-71,-2.4C-73,-28.1,-68,-53.4,-53.2,-65.9C-38.4,-78.4,-13.7,-78.1,3.4,-82.1C20.5,-86.1,41,-89.4,51.7,-64.1Z" />
                            </svg>
                        </motion.div>
                        
                        {avatar_url && (
                            <motion.img 
                                initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
                                src={avatar_url} alt={name} 
                                className="w-full h-full max-w-[400px] object-contain object-bottom relative z-10 drop-shadow-2xl" 
                            />
                        )}
                    </div>

                    {/* Right Typography */}
                    <div className="w-full md:w-1/3 flex flex-col justify-between items-center md:items-end z-20 text-center md:text-right h-[400px]">
                        <motion.p 
                            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-lg md:text-xl font-medium text-slate-800 leading-relaxed max-w-xs mt-12 md:mt-24"
                        >
                            I design beautifully simple things, And I love what i do.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}
                            className="flex flex-col items-center md:items-end gap-6 mb-12"
                        >
                            <div className="w-24 h-24 rounded-full border border-slate-300 flex items-center justify-center relative spin-slow p-2 bg-white shadow-xl">
                                {/* Fake Badge Graphic */}
                                <svg className="w-full h-full text-[#1C2A31]" viewBox="0 0 100 100" fill="currentColor">
                                    <path d="M50 10C27.9 10 10 27.9 10 50s17.9 40 40 40 40-17.9 40-40S72.1 10 50 10zm-5 60h10v10H45V70zm11.7-22.1c-1.3 1.1-2.2 2-2.7 3.6h-8c.4-3.5 2-5.4 4.5-7.4 2.1-1.7 3.5-2.8 3.5-5.1 0-2.4-1.8-4-4.5-4-2.8 0-4.6 1.8-5 5H41c.4-6.6 4.9-10 10-10 6.1 0 10.5 4.1 10.5 9 0 3.7-2.3 6.3-4.8 8.3z"/>
                                </svg>
                            </div>
                            <div className="text-sm font-black tracking-widest text-[#1C2A31] uppercase leading-relaxed md:text-right">
                                {role ? role.replace(' ', '\n') : 'IDF CERTIFIED\nPROFESSIONAL\nUI/UX DESIGNER'}
                            </div>
                        </motion.div>
                    </div>

                </section>
            </div>

            {/* "What do I help?" (Skills / Services) Section */}
            <section id="skills" className="w-full max-w-[1600px] mx-auto py-32 px-8 md:px-16 flex flex-col lg:flex-row gap-20 xl:gap-32 bg-white relative z-20">
                
                {/* Left - Service Cards */}
                <div className="w-full lg:w-5/12 flex flex-col gap-6">
                    {displayedSkills.map((skill, i) => {
                        const Icon = defaultIcons[i % defaultIcons.length];
                        const colorClass = defaultColors[i % defaultColors.length];
                        
                        return (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-8 p-8 md:p-10 rounded-[2rem] bg-white border border-slate-100 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-5px_rgba(0,0,0,0.1)] transition-all cursor-pointer group"
                            >
                                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${colorClass} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-8 h-8 md:w-10 md:h-10" />
                                </div>
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-heading font-black tracking-tight text-[#1C2A31] mb-2">{skill}</h3>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{projects.length > 0 ? (projects.length * (i+1) * 3) : Math.floor(Math.random() * 100) + 10} Projects</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Right - Typography & Stats */}
                <div className="w-full lg:w-7/12 flex flex-col justify-center">
                    <motion.h2 
                        initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        className="text-6xl md:text-7xl lg:text-[5.5rem] font-bold font-heading leading-[1.1] tracking-tight mb-12 text-[#1C2A31]"
                    >
                        What do I help?
                    </motion.h2>
                    
                    <motion.div 
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-600 leading-[2] font-medium max-w-2xl"
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
                        className="flex items-center gap-16 md:gap-32 mt-20 pt-16 border-t border-slate-100"
                    >
                        <div>
                            <h3 className="text-6xl md:text-7xl lg:text-8xl font-black font-heading tracking-tighter text-[#1C2A31] mb-4">
                                {projects.length > 0 ? projects.length * 28 : (285)}+
                            </h3>
                            <p className="text-sm font-bold tracking-widest text-[#215E63] uppercase">Project Completed</p>
                        </div>
                        <div>
                            <h3 className="text-6xl md:text-7xl lg:text-8xl font-black font-heading tracking-tighter text-[#1C2A31] mb-4">
                                190+
                            </h3>
                            <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">Happy Clients</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Selected Work — Cinematic Cards */}
            <section id="projects" className="bg-[#FAF9F6] border-t border-slate-200 py-32 px-8 md:px-16 relative z-10 w-full max-w-[1600px] mx-auto rounded-[3rem] my-12 hidden md:block">
                <h2 className="text-5xl md:text-6xl font-heading font-black tracking-tight mb-20 text-center text-[#1C2A31]">Selected Works</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {projects.map((proj) => (
                        <ProjectCard3D key={proj.id} proj={proj} />
                    ))}
                </div>
            </section>

        </div>
    );
}
