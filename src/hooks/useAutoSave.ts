import { useEffect, useRef } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { supabase } from '../lib/supabase';
import { useHistoryStore } from '../store/useHistoryStore';

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
            education: s.education, projects: s.projects, socials: s.socials,
            avatar_url: s.avatar_url, achievements: s.achievements
        });

        const unsubscribe = useResumeStore.subscribe((state) => {
            // Skip if WE triggered this via isSyncing setState
            if (isSaving.current) return;

            const currentSnapshot = JSON.stringify({
                name: state.name, role: state.role, summary: state.summary,
                skills: state.skills, experience: state.experience,
                education: state.education, projects: state.projects, socials: state.socials,
                avatar_url: state.avatar_url, achievements: state.achievements
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

                            // Check if row exists first. Since public sharing relies on user_id, 
                            // we always sync the ACTIVE one to Supabase's single row for this user.
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

                    // Always sync to the local history store for the Dashboard
                    const currentState = useResumeStore.getState();
                    if (currentState.activeId) {
                        useHistoryStore.getState().saveResume({
                            id: currentState.activeId,
                            title: currentState.role || 'Untitled',
                            lastUpdated: Date.now(),
                            data: {
                                activeId: currentState.activeId,
                                name: currentState.name,
                                role: currentState.role,
                                summary: currentState.summary,
                                skills: currentState.skills,
                                experience: currentState.experience,
                                education: currentState.education,
                                projects: currentState.projects,
                                socials: currentState.socials,
                                avatar_url: currentState.avatar_url,
                                achievements: currentState.achievements
                            }
                        });
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
