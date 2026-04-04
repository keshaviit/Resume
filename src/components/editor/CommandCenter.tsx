import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Wand2, User, Briefcase, GraduationCap, Code, X, Plus, Trash2, Link, Globe, Trophy, Image } from 'lucide-react';
import { useAutoSave } from '../../hooks/useAutoSave';

export function CommandCenter() {
    useAutoSave();
    const { name, role, summary, skills, projects, experience, socials, avatar_url, logo_url, achievements, updateField } = useResumeStore();
    const [newSkill, setNewSkill] = useState('');

    const handleAddSkill = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newSkill.trim()) {
            updateField('skills', [...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar_url' | 'logo_url') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateField(field, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeSkill = (skillToRemove: string) => {
        updateField('skills', skills.filter(s => s !== skillToRemove));
    };

    return (
        <div className="flex w-full h-full relative">
            {/* Vertical Icon-only dock */}
            <div className="w-16 border-r border-white/10 flex flex-col items-center py-6 space-y-8 absolute left-0 top-0 bottom-0 bg-white/5 backdrop-blur-3xl rounded-l-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)] z-20 overflow-y-auto">
                <button onClick={() => document.getElementById('panel-personal')?.scrollIntoView({ behavior: 'smooth' })} className="text-white/40 hover:text-cyan-400 hover:scale-110 transition-all" title="Personal Info"><User className="w-5 h-5" /></button>
                <button onClick={() => document.getElementById('panel-skills')?.scrollIntoView({ behavior: 'smooth' })} className="text-white/40 hover:text-purple-400 hover:scale-110 transition-all" title="Skills"><Code className="w-5 h-5" /></button>
                <button onClick={() => document.getElementById('panel-experience')?.scrollIntoView({ behavior: 'smooth' })} className="text-white/40 hover:text-cyan-400 hover:scale-110 transition-all" title="Experience"><Briefcase className="w-5 h-5" /></button>
                <button onClick={() => document.getElementById('panel-projects')?.scrollIntoView({ behavior: 'smooth' })} className="text-white/40 hover:text-purple-400 hover:scale-110 transition-all" title="Projects"><GraduationCap className="w-5 h-5" /></button>
                <button onClick={() => document.getElementById('panel-socials')?.scrollIntoView({ behavior: 'smooth' })} className="text-white/40 hover:text-cyan-400 hover:scale-110 transition-all" title="Socials"><Globe className="w-5 h-5" /></button>
                <button onClick={() => document.getElementById('panel-achievements')?.scrollIntoView({ behavior: 'smooth' })} className="text-white/40 hover:text-yellow-400 hover:scale-110 transition-all" title="Achievements"><Trophy className="w-5 h-5" /></button>
            </div>

            <div className="pl-24 w-full space-y-8 py-2 custom-scrollbar overflow-y-auto h-full pr-6 pb-24">
                <h2 className="text-3xl font-heading font-bold mb-8">Command Center</h2>

                {/* Section: Personal Info */}
                <div id="panel-personal" className="glass-card p-6 space-y-6 relative group">
                    <div className="flex justify-between items-center outline-none">
                        <h3 className="text-lg font-medium text-white/80 uppercase tracking-widest text-xs flex items-center"><User className="w-4 h-4 mr-2 text-cyan-400" /> Personal Info</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="relative group/field flex items-center gap-4 border-b border-white/20 pb-2">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                                {avatar_url ? <img src={avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : <Image className="w-5 h-5 text-white/40" />}
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-white/40 uppercase">Profile Picture</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <input
                                        value={avatar_url}
                                        onChange={(e) => updateField('avatar_url', e.target.value)}
                                        className="w-full bg-transparent outline-none py-1 text-sm transition-colors text-purple-300"
                                        placeholder="Paste URL..."
                                    />
                                    <label className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 rounded cursor-pointer transition-colors whitespace-nowrap border border-white/20">
                                        Upload
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'avatar_url')} />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="relative group/field flex items-center gap-4 border-b border-white/20 pb-2">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                                {logo_url ? <img src={logo_url} alt="Logo" className="w-full h-full object-contain" /> : <Image className="w-5 h-5 text-white/40" />}
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-white/40 uppercase">Logo Background/Icon</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <input
                                        value={logo_url || ''}
                                        onChange={(e) => updateField('logo_url', e.target.value)}
                                        className="w-full bg-transparent outline-none py-1 text-sm transition-colors text-purple-300"
                                        placeholder="Paste URL..."
                                    />
                                    <label className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 rounded cursor-pointer transition-colors whitespace-nowrap border border-white/20">
                                        Upload
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo_url')} />
                                    </label>
                                </div>
                            </div>
                        </div>
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
                <div id="panel-skills" className="glass-card p-6 space-y-6">
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

                {/* Section: Experience */}
                <div id="panel-experience" className="glass-card p-6 space-y-4">
                    <div className="flex justify-between items-center outline-none mb-4">
                        <h3 className="text-lg font-medium text-white/80 uppercase tracking-widest text-xs flex items-center"><Briefcase className="w-4 h-4 mr-2 text-cyan-400" /> Experience</h3>
                        <button 
                            onClick={() => updateField('experience', [...experience, { id: Date.now().toString(), company: 'New Company', role: 'Role', date: 'Date', description: 'Description' }])}
                            className="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 px-3 py-1 rounded text-xs flex items-center transition-colors"
                        >
                            <Plus className="w-3 h-3 mr-1" /> Add
                        </button>
                    </div>
                    {experience.map((exp, i) => (
                        <div key={exp.id} className="p-4 bg-white/5 border border-white/10 rounded-xl relative group/exp mb-4">
                            <button 
                                onClick={() => updateField('experience', experience.filter(e => e.id !== exp.id))}
                                className="absolute top-4 right-4 text-white/20 hover:text-red-400 transition-colors"
                                title="Delete Experience"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-2 gap-4 mb-3 pr-8">
                                <input
                                    value={exp.role}
                                    onChange={(e) => {
                                        const newExp = [...experience];
                                        newExp[i].role = e.target.value;
                                        updateField('experience', newExp);
                                    }}
                                    className="w-full bg-transparent border-b border-white/20 focus:border-cyan-400 outline-none pb-1 font-bold text-lg"
                                    placeholder="Role (e.g. Software Engineer)"
                                />
                                <input
                                    value={exp.company}
                                    onChange={(e) => {
                                        const newExp = [...experience];
                                        newExp[i].company = e.target.value;
                                        updateField('experience', newExp);
                                    }}
                                    className="w-full bg-transparent border-b border-white/20 focus:border-cyan-400 outline-none pb-1 text-purple-300"
                                    placeholder="Company"
                                />
                                <input
                                    value={exp.date}
                                    onChange={(e) => {
                                        const newExp = [...experience];
                                        newExp[i].date = e.target.value;
                                        updateField('experience', newExp);
                                    }}
                                    className="w-full bg-transparent border-b border-white/20 focus:border-cyan-400 outline-none pb-1 text-sm text-white/50 col-span-2"
                                    placeholder="Date Range (e.g. Jan 2021 - Present)"
                                />
                            </div>
                            <textarea
                                value={exp.description}
                                onChange={(e) => {
                                    const newExp = [...experience];
                                    newExp[i].description = e.target.value;
                                    updateField('experience', newExp);
                                }}
                                className="w-full bg-transparent outline-none text-sm text-white/70 resize-y min-h-[60px]"
                                placeholder="Describe your achievements..."
                            />
                        </div>
                    ))}
                </div>

                {/* Section: Projects */}
                <div id="panel-projects" className="glass-card p-6 space-y-4">
                    <div className="flex justify-between items-center outline-none mb-4">
                        <h3 className="text-lg font-medium text-white/80 uppercase tracking-widest text-xs flex items-center"><Code className="w-4 h-4 mr-2 text-cyan-400" /> Projects</h3>
                        <button 
                            onClick={() => updateField('projects', [...projects, { id: Date.now().toString(), title: 'New Project', description: 'Description', link: '', tags: [] }])}
                            className="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 px-3 py-1 rounded text-xs flex items-center transition-colors"
                        >
                            <Plus className="w-3 h-3 mr-1" /> Add
                        </button>
                    </div>
                    {projects.map((proj, i) => (
                        <div key={proj.id} className="p-4 bg-white/5 border border-white/10 rounded-xl relative group/proj mb-4">
                            <button 
                                onClick={() => updateField('projects', projects.filter(p => p.id !== proj.id))}
                                className="absolute top-4 right-4 text-white/20 hover:text-red-400 transition-colors"
                                title="Delete Project"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-2 gap-4 mb-2 pr-8">
                                <input
                                    value={proj.title}
                                    onChange={(e) => {
                                        const newProjs = [...projects];
                                        newProjs[i].title = e.target.value;
                                        updateField('projects', newProjs);
                                    }}
                                    className="w-full bg-transparent border-b border-white/20 focus:border-cyan-400 outline-none pb-1 font-bold text-lg"
                                    placeholder="Project Title"
                                />
                                <input
                                    value={proj.image_url || ''}
                                    onChange={(e) => {
                                        const newProjs = [...projects];
                                        newProjs[i].image_url = e.target.value;
                                        updateField('projects', newProjs);
                                    }}
                                    className="w-full bg-transparent border-b border-white/20 focus:border-purple-400 outline-none pb-1 text-sm text-purple-300"
                                    placeholder="Image URL (e.g. imgur.com/..)"
                                />
                                <div className="flex items-center text-sm text-white/50 border-b border-white/20 focus-within:border-cyan-400 transition-colors pb-1">
                                    <Link className="w-3.5 h-3.5 mr-2" />
                                    <input
                                        value={proj.link || ''}
                                        onChange={(e) => {
                                            const newProjs = [...projects];
                                            newProjs[i].link = e.target.value;
                                            updateField('projects', newProjs);
                                        }}
                                        className="w-full bg-transparent outline-none"
                                        placeholder="Live Demo URL"
                                    />
                                </div>
                                <div className="flex items-center text-sm text-white/50 border-b border-white/20 focus-within:border-purple-400 transition-colors pb-1">
                                    <Globe className="w-3.5 h-3.5 mr-2" />
                                    <input
                                        value={proj.github_link || ''}
                                        onChange={(e) => {
                                            const newProjs = [...projects];
                                            newProjs[i].github_link = e.target.value;
                                            updateField('projects', newProjs);
                                        }}
                                        className="w-full bg-transparent outline-none text-purple-200"
                                        placeholder="GitHub Source URL"
                                    />
                                </div>
                            </div>
                            <textarea
                                value={proj.description}
                                onChange={(e) => {
                                    const newProjs = [...projects];
                                    newProjs[i].description = e.target.value;
                                    updateField('projects', newProjs);
                                }}
                                className="w-full bg-transparent outline-none text-sm text-white/70 resize-y min-h-[40px] mt-2 mb-2"
                                placeholder="Project Description..."
                            />
                            <div className="grid grid-cols-2 gap-4 pr-8">
                                <input
                                    value={proj.key_features?.join(', ') || ''}
                                    onChange={(e) => {
                                        const newProjs = [...projects];
                                        newProjs[i].key_features = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                        updateField('projects', newProjs);
                                    }}
                                    className="w-full bg-black/20 border border-white/10 rounded px-3 py-1.5 focus:border-cyan-400 outline-none text-xs text-cyan-200"
                                    placeholder="Key Features (comma separated)"
                                />
                                <input
                                    value={proj.tags?.join(', ') || ''}
                                    onChange={(e) => {
                                        const newProjs = [...projects];
                                        newProjs[i].tags = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                        updateField('projects', newProjs);
                                    }}
                                    className="w-full bg-black/20 border border-white/10 rounded px-3 py-1.5 focus:border-purple-400 outline-none text-xs text-purple-200"
                                    placeholder="Tags (comma separated. e.g. React, Node)"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Section: Social Media */}
                <div id="panel-socials" className="glass-card p-6 space-y-4">
                    <div className="flex justify-between items-center outline-none mb-4">
                        <h3 className="text-lg font-medium text-white/80 uppercase tracking-widest text-xs flex items-center"><Globe className="w-4 h-4 mr-2 text-purple-400" /> Social Links</h3>
                        <button 
                            onClick={() => updateField('socials', [...(socials || []), { id: Date.now().toString(), platform: 'LinkedIn', link: '' }])}
                            className="bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 px-3 py-1 rounded text-xs flex items-center transition-colors"
                        >
                            <Plus className="w-3 h-3 mr-1" /> Add
                        </button>
                    </div>
                    {(socials || []).map((social, i) => (
                        <div key={social.id} className="flex gap-3 items-center bg-white/5 border border-white/10 rounded-lg p-2 relative group">
                            <input
                                value={social.platform}
                                onChange={(e) => {
                                    const newSocials = [...socials];
                                    newSocials[i].platform = e.target.value;
                                    updateField('socials', newSocials);
                                }}
                                className="w-1/3 bg-transparent border-b border-white/20 focus:border-purple-400 outline-none text-sm px-2 py-1"
                                placeholder="Platform (e.g. LinkedIn)"
                            />
                            <div className="flex-1 flex items-center bg-black/20 rounded px-2">
                                <Link className="w-3.5 h-3.5 text-white/40 mr-2" />
                                <input
                                    value={social.link}
                                    onChange={(e) => {
                                        const newSocials = [...socials];
                                        newSocials[i].link = e.target.value;
                                        updateField('socials', newSocials);
                                    }}
                                    className="w-full bg-transparent outline-none text-sm py-1.5"
                                    placeholder="https://"
                                />
                            </div>
                            <button 
                                onClick={() => updateField('socials', socials.filter(s => s.id !== social.id))}
                                className="text-white/20 hover:text-red-400 transition-colors p-2"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Section: Achievements */}
                <div id="panel-achievements" className="glass-card p-6 space-y-4">
                    <div className="flex justify-between items-center outline-none mb-4">
                        <h3 className="text-lg font-medium text-white/80 uppercase tracking-widest text-xs flex items-center"><Trophy className="w-4 h-4 mr-2 text-yellow-400" /> Achievements</h3>
                        <button 
                            onClick={() => updateField('achievements', [...(achievements || []), { id: Date.now().toString(), title: 'New Achievement', event: 'Event/Issuer', date: 'Date', description: '', link: '' }])}
                            className="bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 px-3 py-1 rounded text-xs flex items-center transition-colors"
                        >
                            <Plus className="w-3 h-3 mr-1" /> Add
                        </button>
                    </div>
                    {(achievements || []).map((ach, i) => (
                        <div key={ach.id} className="p-4 bg-white/5 border border-white/10 rounded-xl relative group/ach mb-4">
                            <button 
                                onClick={() => updateField('achievements', achievements.filter(a => a.id !== ach.id))}
                                className="absolute top-4 right-4 text-white/20 hover:text-red-400 transition-colors"
                                title="Delete Achievement"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-2 gap-4 mb-3 pr-8">
                                <input
                                    value={ach.title}
                                    onChange={(e) => {
                                        const newAch = [...achievements];
                                        newAch[i].title = e.target.value;
                                        updateField('achievements', newAch);
                                    }}
                                    className="w-full bg-transparent border-b border-white/20 focus:border-yellow-400 outline-none pb-1 font-bold text-lg"
                                    placeholder="Title (e.g. Winner)"
                                />
                                <input
                                    value={ach.event}
                                    onChange={(e) => {
                                        const newAch = [...achievements];
                                        newAch[i].event = e.target.value;
                                        updateField('achievements', newAch);
                                    }}
                                    className="w-full bg-transparent border-b border-white/20 focus:border-yellow-400 outline-none pb-1 text-purple-300"
                                    placeholder="Event/Issuer (e.g. Global Hackathon)"
                                />
                                <input
                                    value={ach.date}
                                    onChange={(e) => {
                                        const newAch = [...achievements];
                                        newAch[i].date = e.target.value;
                                        updateField('achievements', newAch);
                                    }}
                                    className="w-full bg-transparent border-b border-white/20 focus:border-yellow-400 outline-none pb-1 text-sm text-white/50"
                                    placeholder="Date"
                                />
                                <div className="flex items-center text-sm text-white/50 border-b border-white/20 focus-within:border-yellow-400 transition-colors pb-1">
                                    <Link className="w-3.5 h-3.5 mr-2 shrink-0" />
                                    <input
                                        value={ach.link || ''}
                                        onChange={(e) => {
                                            const newAch = [...achievements];
                                            newAch[i].link = e.target.value;
                                            updateField('achievements', newAch);
                                        }}
                                        className="w-full bg-transparent outline-none"
                                        placeholder="Certificate Link (optional)"
                                    />
                                </div>
                            </div>
                            <textarea
                                value={ach.description}
                                onChange={(e) => {
                                    const newAch = [...achievements];
                                    newAch[i].description = e.target.value;
                                    updateField('achievements', newAch);
                                }}
                                className="w-full bg-transparent outline-none text-sm text-white/70 resize-y min-h-[60px]"
                                placeholder="Describe what you built or learned..."
                            />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
