import { useEffect, useRef } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { supabase } from '../lib/supabase';

export function useAutoSave() {
    const isSaving = useRef(false);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        let lastSnapshot = '';

        // Take initial snapshot WITHOUT triggering any state changes
        const s = useResumeStore.getState();
        lastSnapshot = JSON.stringify({
            name: s.name, role: s.role, summary: s.summary,
            skills: s.skills, experience: s.experience,
            education: s.education, projects: s.projects
        });

        const unsubscribe = useResumeStore.subscribe((state) => {
            // Skip if WE triggered this via isSyncing setState
            if (isSaving.current) return;

            const currentSnapshot = JSON.stringify({
                name: state.name, role: state.role, summary: state.summary,
                skills: state.skills, experience: state.experience,
                education: state.education, projects: state.projects
            });

            if (lastSnapshot && currentSnapshot !== lastSnapshot) {
                clearTimeout(timeout);
                timeout = setTimeout(async () => {
                    isSaving.current = true;
                    useResumeStore.setState({ isSyncing: true });
                    isSaving.current = false;

                    try {
                        const { data: { session } } = await supabase.auth.getSession();
                        if (session?.user?.id) {
                            const payload = JSON.parse(currentSnapshot);
                            payload.user_id = session.user.id;

                            // Check if row exists first
                            const { data: existing } = await supabase.from('resumes').select('id').eq('user_id', session.user.id).maybeSingle();

                            if (existing) {
                                // UPDATE existing row
                                await supabase.from('resumes').update(payload).eq('user_id', session.user.id);
                            } else {
                                // INSERT new row
                                await supabase.from('resumes').insert(payload);
                            }
                        }
                    } catch (e) {
                        console.error('AutoSave error:', e);
                    }

                    isSaving.current = true;
                    useResumeStore.setState({ isSyncing: false });
                    isSaving.current = false;
                }, 1500);
            }
            lastSnapshot = currentSnapshot;
        });

        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, []);
}
