import { Plus, Clock, Edit2, Trash2, Share2 } from 'lucide-react';
import { useHistoryStore } from '../../store/useHistoryStore';
import type { SavedResume } from '../../store/useHistoryStore';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

interface Props {
    onCreateNew: () => void;
    onEditResume: (id: string, data: any) => void;
}

export function Dashboard({ onCreateNew, onEditResume }: Props) {
    const { resumes, deleteResume } = useHistoryStore();
    const isAtLimit = resumes.length >= 2;

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to permanently delete this resume? The public link will become broken.')) {
            // Delete locally
            deleteResume(id);
            // Optionally delete from remote db so shared link is removed
            try {
                await supabase.from('resumes').delete().eq('id', id);
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="w-full h-full bg-[#050505] text-white p-12 overflow-y-auto custom-scrollbar">
            <div className="max-w-6xl mx-auto space-y-12">

                <header>
                    <h1 className="text-4xl font-heading font-bold tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-white/50">Select a resume to update its details, or create a brand new one.</p>
                </header>

                {isAtLimit && (
                    <div className="bg-purple-500/10 border border-purple-500/30 text-purple-300 p-4 rounded-xl flex items-center justify-between">
                        <span className="font-medium">You have reached the maximum free limit of 2 resumes.</span>
                        <span className="text-xs text-white/50 bg-black/40 px-3 py-1 rounded-full border border-white/10">Free Tier</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Create New Card */}
                    <motion.div
                        whileHover={!isAtLimit ? { scale: 1.02 } : {}}
                        whileTap={!isAtLimit ? { scale: 0.98 } : {}}
                        onClick={() => { if (!isAtLimit) onCreateNew(); }}
                        className={`h-64 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${isAtLimit ? 'border-white/5 bg-white/[0.02] cursor-not-allowed opacity-50' : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-cyan-500/50 cursor-pointer neon-glow group'}`}
                    >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform ${isAtLimit ? 'bg-white/5' : 'bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 group-hover:scale-110'}`}>
                            <Plus className={`w-8 h-8 ${isAtLimit ? 'text-white/20' : 'text-cyan-400 group-hover:text-cyan-300'}`} />
                        </div>
                        <span className={`font-heading font-bold text-lg ${isAtLimit ? 'text-white/20' : 'text-white/80 group-hover:text-white'}`}>
                            {isAtLimit ? 'Limit Reached' : 'Create New Resume'}
                        </span>
                    </motion.div>

                    {/* Previous Resumes */}
                    <AnimatePresence>
                        {resumes.map((resume: SavedResume) => (
                            <motion.div
                                key={resume.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="h-64 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/30 p-8 flex flex-col justify-between relative cursor-pointer group"
                                onClick={() => onEditResume(resume.id, resume.data)}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />

                                <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const publicUrl = `${window.location.origin}/?p=${resume.id}`;
                                            navigator.clipboard.writeText(publicUrl);
                                            alert('Public link copied to clipboard!');
                                        }}
                                        className="p-2 rounded-full bg-white/5 hover:bg-cyan-500/20 text-white/40 hover:text-cyan-400 transition-all"
                                        title="Copy Share Link"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={(e) => handleDelete(e, resume.id)}
                                        className="p-2 rounded-full bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all"
                                        title="Delete Resume"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="relative z-10 pr-10">
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
                                            e.stopPropagation();
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
