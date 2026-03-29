import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Wand2, User, Briefcase, GraduationCap, Code, X } from 'lucide-react';
import { useAutoSave } from '../../hooks/useAutoSave';

export function CommandCenter() {
    useAutoSave();
    const { name, role, summary, skills, projects, updateField } = useResumeStore();
    const [newSkill, setNewSkill] = useState('');

    const handleAddSkill = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newSkill.trim()) {
            updateField('skills', [...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        updateField('skills', skills.filter(s => s !== skillToRemove));
    };

    return (
        <div className="flex w-full h-full relative">
            {/* Vertical Icon-only dock */}
            <div className="w-16 border-r border-white/10 flex flex-col items-center py-6 space-y-8 absolute left-0 top-0 bottom-0 bg-white/5 backdrop-blur-3xl rounded-l-2xl shadow-xl z-20">
                <button className="text-white/40 hover:text-cyan-400 transition-colors" title="Personal Info"><User className="w-5 h-5" /></button>
                <button className="text-white/40 hover:text-purple-400 transition-colors" title="Experience"><Briefcase className="w-5 h-5" /></button>
                <button className="text-white/40 hover:text-cyan-400 transition-colors" title="Skills"><Code className="w-5 h-5" /></button>
                <button className="text-white/40 hover:text-purple-400 transition-colors" title="Education"><GraduationCap className="w-5 h-5" /></button>
            </div>

            <div className="pl-24 w-full space-y-8 py-2">
                <h2 className="text-3xl font-heading font-bold mb-8">Command Center</h2>

                {/* Section: Personal Info */}
                <div className="glass-card p-6 space-y-6 relative group">
                    <div className="flex justify-between items-center outline-none">
                        <h3 className="text-lg font-medium text-white/80 uppercase tracking-widest text-xs flex items-center"><User className="w-4 h-4 mr-2 text-cyan-400" /> Personal Info</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="relative group/field">
                            <label className="text-xs text-white/40 uppercase">Full Name</label>
                            <input
                                value={name}
                                onChange={(e) => updateField('name', e.target.value)}
                                className="w-full bg-transparent border-b border-white/20 focus:border-cyan-400 outline-none py-2 text-xl font-medium transition-colors"
                                placeholder="Name"
                            />
                        </div>

                        <div className="relative group/field">
                            <label className="text-xs text-white/40 uppercase">Target Role</label>
                            <input
                                value={role}
                                onChange={(e) => updateField('role', e.target.value)}
                                className="w-full bg-transparent border-b border-white/20 focus:border-cyan-400 outline-none py-2 text-xl transition-colors"
                                placeholder="Role"
                            />
                        </div>

                        <div className="relative group/field">
                            <label className="text-xs text-white/40 uppercase">Summary (AI Assisted)</label>
                            <textarea
                                value={summary}
                                onChange={(e) => updateField('summary', e.target.value)}
                                className="w-full bg-transparent border-b border-white/20 focus:border-cyan-400 outline-none py-2 min-h-[100px] resize-none transition-colors mt-2"
                                placeholder="A brief summary of your background..."
                            />
                            <button
                                title="AI Suggestion: Make this more action-oriented"
                                className="absolute right-0 top-12 opacity-0 group-hover/field:opacity-100 text-purple-400 transition-opacity bg-black/50 p-1.5 rounded-full border border-purple-500/30 hover:neon-glow"
                                onClick={() => updateField('summary', summary + ' (Enhanced by AI: Demonstrated scalable systems design)')}
                            >
                                <Wand2 className="w-4 h-4 cursor-pointer" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section: Skills */}
                <div className="glass-card p-6 space-y-6">
                    <div className="flex justify-between items-center outline-none">
                        <h3 className="text-lg font-medium text-white/80 uppercase tracking-widest text-xs flex items-center"><Code className="w-4 h-4 mr-2 text-purple-400" /> Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {skills.map(skill => (
                            <span key={skill} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm flex items-center group/skill">
                                {skill}
                                <button onClick={() => removeSkill(skill)} className="ml-2 text-white/40 hover:text-red-400 focus:outline-none">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="relative">
                        <input
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={handleAddSkill}
                            placeholder="Type a skill and press Enter"
                            className="w-full bg-black/20 border border-white/10 focus:border-purple-400 outline-none px-4 py-3 rounded-xl transition-colors text-sm"
                        />
                        {/* AI Insight Tooltip Stub */}
                        <div className="absolute -top-12 right-0 text-xs px-3 py-1.5 bg-purple-500/20 text-purple-200 border border-purple-500/30 rounded-lg whitespace-nowrap hidden md:block">
                            AI Tip: Add 2 more skills to reach Expert view.
                        </div>
                    </div>
                </div>

                {/* Section: Projects (Stubbed) */}
                <div className="glass-card p-6 space-y-4">
                    <div className="flex justify-between items-center outline-none">
                        <h3 className="text-lg font-medium text-white/80 uppercase tracking-widest text-xs flex items-center"><Briefcase className="w-4 h-4 mr-2 text-cyan-400" /> Projects</h3>
                    </div>
                    {projects.map((proj, i) => (
                        <div key={proj.id} className="p-4 bg-white/5 border border-white/10 rounded-xl relative group/proj">
                            <input
                                value={proj.title}
                                onChange={(e) => {
                                    const newProjs = [...projects];
                                    newProjs[i].title = e.target.value;
                                    updateField('projects', newProjs);
                                }}
                                className="w-full bg-transparent border-b border-white/20 focus:border-cyan-400 outline-none pb-1 font-bold text-lg mb-2"
                            />
                            <textarea
                                value={proj.description}
                                onChange={(e) => {
                                    const newProjs = [...projects];
                                    newProjs[i].description = e.target.value;
                                    updateField('projects', newProjs);
                                }}
                                className="w-full bg-transparent outline-none text-sm text-white/70 resize-none h-16"
                            />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
