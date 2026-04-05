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
            avatar_url: s.avatar_url, achievements: s.achievements, theme: s.theme
        });

        const unsubscribe = useResumeStore.subscribe((state) => {
            // Skip if WE triggered this via isSyncing setState
            if (isSaving.current) return;

            const currentSnapshot = JSON.stringify({
                name: state.name, role: state.role, summary: state.summary,
                skills: state.skills, experience: state.experience,
                education: state.education, projects: state.projects, socials: state.socials,
                avatar_url: state.avatar_url, achievements: state.achievements, theme: state.theme
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
                            delete payload.theme; // dont sync theme to supabase because schema lacks it

                            // Ensure each resume gets a unique ID for sharing.
                            const currentState = useResumeStore.getState();
                            if (currentState.activeId) {
                                payload.id = currentState.activeId;
                                // Upsert automatically updates if id exists or inserts if it doesn't.
                                await supabase.from('resumes').upsert(payload);
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
                                achievements: currentState.achievements,
                                theme: currentState.theme
                            }
                        });
                    }

                    isSaving.current = true;
                    useResumeStore.setState({ isSyncing: false });
                    isSaving.current = false;
                }, 5000); // Increased debounce to 5s to reduce server load
            }
            lastSnapshot = currentSnapshot;
        });

        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, []);
}
