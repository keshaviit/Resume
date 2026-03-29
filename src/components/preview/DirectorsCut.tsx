
import { useResumeStore } from '../../store/useResumeStore';
import { motion } from 'framer-motion';
import { ExternalLink, Briefcase, Calendar, Building2 } from 'lucide-react';

export function DirectorsCut() {
    const { name, role, summary, skills, projects, experience } = useResumeStore();

    // Deduplicate skills to prevent React key warnings
    const uniqueSkills = [...new Set(skills)];

    return (
        <div className="w-full h-full bg-[#050505] text-white overflow-y-auto overflow-x-hidden relative font-body custom-scrollbar">
            {/* Portfolio Header Canvas */}
            <section className="min-h-[60vh] flex flex-col justify-center px-12 relative overflow-hidden pt-12 pb-12">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />

                <div className="z-10 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-sm font-medium mb-6 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                    >
                        {role || 'Professional Role'}
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-6xl md:text-7xl font-heading font-bold mb-6 tracking-tight leading-tight"
                    >
                        I'm <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">{name || 'Your Name'}</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-2xl text-xl text-white/70 leading-relaxed font-light"
                    >
                        {summary || 'Your impactful summary goes here...'}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-12 flex items-center space-x-4"
                    >
                        <button className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-colors">
                            Contact Me
                        </button>
                        <button className="px-8 py-4 border border-white/20 rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm">
                            View Resume
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Skills Badges - using index to avoid duplicate key */}
            <section className="px-12 py-12 border-t border-b border-white/5 bg-white/[0.01]">
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

            {/* Selected Work — Cinematic Full-Width Cards */}
            <section className="p-12">
                <h2 className="text-3xl font-heading font-bold mb-10">Selected Work</h2>
                <div className="flex flex-col gap-8">
                    {projects.map((proj, i) => {
                        const isTop = i === 0;
                        return (
                            <motion.div
                                key={proj.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className={`group relative rounded-3xl border p-8 md:p-10 transition-all cursor-pointer overflow-hidden hover:-translate-y-1 hover:shadow-2xl ${isTop ? 'bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/5 border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.15)]' : 'bg-white/[0.03] border-white/10 hover:border-cyan-500/30'}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Top bar: Badge + Link */}
                                <div className="flex items-center justify-between mb-6 relative z-10">
                                    {isTop ? (
                                        <div className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30 backdrop-blur-sm shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                                            Most Impactful
                                        </div>
                                    ) : (
                                        <div className="px-3 py-1 text-xs font-medium text-white/40 border border-white/10 rounded-full">
                                            Project {i + 1}
                                        </div>
                                    )}
                                    {proj.link && (
                                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors group/link">
                                            <span className="hidden md:inline">View Project</span>
                                            <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                        </a>
                                    )}
                                </div>

                                {/* Content: 2-column */}
                                <div className="flex flex-col md:flex-row gap-8 relative z-10">
                                    <div className="flex-1">
                                        <h3 className={`${isTop ? 'text-4xl' : 'text-3xl'} font-bold font-heading mb-6 tracking-tight leading-tight`}>{proj.title}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {proj.tags.map((tag, tIdx) => (
                                                <span key={`${proj.id}-tag-${tIdx}`} className="px-3 py-1.5 text-xs font-semibold border border-white/10 rounded-lg bg-black/40 text-cyan-100 tracking-wide backdrop-blur-sm group-hover:border-white/20 transition-colors">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex-[1.5] md:border-l border-white/10 md:pl-10">
                                        <p className={`text-white/70 leading-relaxed font-light ${isTop ? 'text-lg' : 'text-base'}`}>{proj.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* Experience — Premium Timeline */}
            <section className="px-12 py-16 border-t border-white/5 relative">
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
                            <div className="absolute left-[22px] top-1 w-[14px] h-[14px] rounded-full border-[3px] border-[#050505] bg-gradient-to-br from-purple-500 to-cyan-500 shadow-[0_0_12px_rgba(168,85,247,0.6)] group-hover:scale-125 transition-transform z-10" />

                            {/* Card */}
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 group-hover:border-purple-500/30 group-hover:bg-white/[0.05] transition-all duration-300 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                                        <h4 className="font-bold text-xl font-heading text-white group-hover:text-cyan-50 transition-colors">{exp.role}</h4>
                                        <div className="flex items-center gap-1.5 text-sm font-medium text-cyan-400 shrink-0">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {exp.date}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-purple-300 font-medium mb-5">
                                        <Building2 className="w-4 h-4" />
                                        {exp.company}
                                    </div>

                                    <p className="text-white/60 text-sm leading-relaxed">{exp.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
