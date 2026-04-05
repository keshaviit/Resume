import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useResumeStore } from '../../store/useResumeStore';
import { DirectorsCut } from './DirectorsCut';
import { motion } from 'framer-motion';

export function PublicProfile({ id }: { id: string }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const { data, error } = await supabase
                    .from('resumes')
                    .select('*')
                    .eq('id', id)
                    .maybeSingle();

                if (error || !data) {
                    setError('Resume not found or is private.');
                    return;
                }

                const { updateField } = useResumeStore.getState();
                if (data.name) updateField('name', data.name);
                if (data.role) updateField('role', data.role);
                if (data.summary) updateField('summary', data.summary);
                if (data.skills) updateField('skills', data.skills);
                if (data.experience) updateField('experience', data.experience);
                if (data.education) updateField('education', data.education);
                if (data.projects) updateField('projects', data.projects);
                if (data.socials) updateField('socials', data.socials);
                if (data.achievements) updateField('achievements', data.achievements);
                // avatar_url is critical — load even if empty string to clear placeholder
                updateField('avatar_url', data.avatar_url || '');
                updateField('logo_url', data.logo_url || '');
                updateField('theme', 'cyberpunk'); // public always starts in dark mode
            } catch (err) {
                setError('Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                    <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white/70 font-body">
                <p className="text-xl mb-4">{error}</p>
                <a href="/" className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                    Build Your Own Resume
                </a>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#050505] overflow-y-auto relative">
            {/* We render the DirectorsCut directly in a max-width container */}
            <div className="max-w-5xl mx-auto w-full pb-20">
                <DirectorsCut />
            </div>

            {/* Floating "Built with PortfolioAI" badge */}
            <a
                href="/"
                className="fixed bottom-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-xs font-mono text-white/50 hover:text-white hover:border-white/30 transition-all z-50 flex items-center gap-2"
            >
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                Built with PortfolioAI
            </a>
        </div>
    );
}
