



import { useResumeStore } from '../../store/useResumeStore';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Building2, Globe } from 'lucide-react';

export function DirectorsCut() {
    const { name, role, summary, skills, projects, experience, socials, avatar_url, achievements } = useResumeStore();

    // Deduplicate skills to prevent React key warnings
    const uniqueSkills = [...new Set(skills)];

    return (
        <div className="w-full h-full bg-[#050505] text-white overflow-y-auto overflow-x-hidden relative font-body custom-scrollbar">
            {/* Sticky Navigation Taskbar */}
            <nav className="sticky top-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/5 py-4 px-12">
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

            {/* Portfolio Header Canvas */}
            <section id="hero" className="min-h-[60vh] flex flex-col justify-center px-12 relative overflow-hidden pt-12 pb-12">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />

                <div className="z-10 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-sm font-medium mb-6 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                    >
                        {role || 'Professional Role'}
                    </motion.div>
                    <div className="flex flex-col md:flex-row md:items-center gap-8 mb-6">
                        {avatar_url && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
                                className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border border-white/20 shadow-[0_0_30px_rgba(34,211,238,0.2)] shrink-0"
                            >
                                <img src={avatar_url} alt={name} className="w-full h-full object-cover" />
                            </motion.div>
                        )}
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-6xl md:text-7xl font-heading font-bold tracking-tight leading-tight"
                            >
                                I'm <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">{name || 'Your Name'}</span>
                            </motion.h1>
                        </div>
                    </div>
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
                        <button 
                            className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-colors"
                            onClick={() => {
                                const linkedIn = socials?.find(s => s.platform.toLowerCase() === 'linkedin');
                                if (linkedIn && linkedIn.link) {
                                    window.open(linkedIn.link, '_blank');
                                } else {
                                    window.location.href = `mailto:?subject=Hello ${name}&body=I saw your portfolio and would like to connect!`;
                                }
                            }}
                        >
                            Contact Me
                        </button>
                        <button 
                            className="px-8 py-4 border border-white/20 rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm"
                            onClick={async () => {
                                const { supabase } = await import('../../lib/supabase');
                                const { data: { session } } = await supabase.auth.getSession();
                                if (session?.user?.id) {
                                    window.open(`/?p=${session.user.id}`, '_blank');
                                } else {
                                    alert('Please log in or save your resume first.');
                                }
                            }}
                        >
                            View Resume
                        </button>
                    </motion.div>

                    {/* Socials Row */}
                    {socials && socials.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
                            className="mt-8 flex items-center gap-4"
                        >
                            {socials.map(social => {
                                let Icon = null;
                                const plat = social.platform.toLowerCase();
                                if (plat.includes('linkedin')) {
                                    Icon = <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>;
                                } else if (plat.includes('instagram')) {
                                    Icon = <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069v-2.163zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>;
                                } else if (plat.includes('leetcode')) {
                                    Icon = <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.939 5.939 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.956-.207a1.384 1.384 0 0 0-.207-1.953l-3.5-2.831c-2.226-1.799-5.366-1.374-7.337.814l-2.316 2.576H19.28c.76 0 1.376-.616 1.376-1.376 0-.76-.616-1.376-1.376-1.376H4.21l1.554-1.727L11.171 1.42c.523-.561 1.392-.583 1.942-.051l1.637 1.603a1.37 1.37 0 0 0 1.905-.035 1.378 1.378 0 0 0-.036-1.948L14.981.427A1.376 1.376 0 0 0 13.483 0zm-1.848 16.513c-.76 0-1.375.616-1.375 1.376 0 .76.616 1.376 1.375 1.376h5.836c.76 0 1.376-.616 1.376-1.376 0-.76-.616-1.376-1.376-1.376h-5.836z" /></svg>;
                                } else {
                                    Icon = <Globe className="w-5 h-5" />;
                                }

                                return (
                                    <a 
                                        key={social.id}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/20 hover:border-white/30 text-white/70 hover:text-white transition-all hover:scale-110 flex items-center justify-center"
                                        title={social.platform}
                                    >
                                        {Icon}
                                    </a>
                                );
                            })}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Skills Badges  */}
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

            {/* Selected Work — Cinematic Full-Width Cards */}
            <section id="projects" className="p-12">
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
