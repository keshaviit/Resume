import { Plus, Clock, Edit2 } from 'lucide-react';
import { useHistoryStore } from '../../store/useHistoryStore';
import type { SavedResume } from '../../store/useHistoryStore';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    onCreateNew: () => void;
    onEditResume: (id: string, data: any) => void;
}

export function Dashboard({ onCreateNew, onEditResume }: Props) {
    const { resumes } = useHistoryStore();

    return (
        <div className="w-full h-full bg-[#050505] text-white p-12 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-12">

                <header>
                    <h1 className="text-4xl font-heading font-bold tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-white/50">Select a resume to update its details, or create a brand new one.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Create New Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onCreateNew}
                        className="h-64 rounded-3xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-cyan-500/50 flex flex-col items-center justify-center cursor-pointer transition-all neon-glow group"
                    >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300" />
                        </div>
                        <span className="font-heading font-bold text-lg text-white/80 group-hover:text-white">Create New Resume</span>
                    </motion.div>

                    {/* Previous Resumes */}
                    <AnimatePresence>
                        {resumes.map((resume: SavedResume) => (
                            <motion.div
                                key={resume.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-64 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/30 p-8 flex flex-col justify-between relative cursor-pointer group"
                                onClick={() => onEditResume(resume.id, resume.data)}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />

                                <div className="relative z-10">
                                    <div className="px-3 py-1 inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-full mb-4 border border-cyan-500/20">
                                        <Clock className="w-3 h-3" />
                                        {new Date(resume.lastUpdated).toLocaleDateString()}
                                    </div>
                                    <h3 className="text-2xl font-bold font-heading mb-2 line-clamp-2">
                                        {resume.title || resume.data.role || "Untitled Resume"}
                                    </h3>
                                    <p className="text-white/50 text-sm line-clamp-2">
                                        {resume.data.summary || "No summary available."}
                                    </p>
                                </div>

                                <div className="relative z-10 flex items-center justify-end">
                                    <button
                                        className="flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevent double triggering
                                            onEditResume(resume.id, { ...resume.data, activeId: resume.id });
                                        }}
                                    >
                                        Update Resume
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}
