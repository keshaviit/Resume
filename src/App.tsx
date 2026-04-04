import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';
import { AuthPage } from './components/auth/AuthPage';
import { AppLayout } from './components/layout/AppLayout';
import { LandingUpload } from './components/landing/LandingUpload';
import { CommandCenter } from './components/editor/CommandCenter';
import { DirectorsCut } from './components/preview/DirectorsCut';
import { PublicProfile } from './components/preview/PublicProfile';
import { useResumeStore } from './store/useResumeStore';

import { Dashboard } from './components/dashboard/Dashboard';
import { useHistoryStore } from './store/useHistoryStore';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [step, setStep] = useState<'dashboard' | 'upload' | 'editor'>('dashboard');
  const [isInitializing, setIsInitializing] = useState(true);
  const [publicResumeId, setPublicResumeId] = useState<string | null>(null);

  useEffect(() => {
    // Check if URL is asking for a public profile
    const params = new URLSearchParams(window.location.search);
    const pId = params.get('p');
    if (pId) {
      setPublicResumeId(pId);
      setIsInitializing(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitializing(false);
    }).catch((err) => {
      console.error("Failed to get session:", err);
      setIsInitializing(false); // Make sure we don't stay on the blank loading screen forever
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      if (session) {
        try {
          const { data, error } = await supabase.from('resumes').select('*').eq('user_id', session.user.id).maybeSingle();
          if (data && !error) {
            const store = useResumeStore.getState();
            store.loadResume(data.id || 'supabase-main', {
              name: data.name || '',
              role: data.role || '',
              summary: data.summary || '',
              skills: data.skills || [],
              experience: data.experience || [],
              education: data.education || [],
              projects: data.projects || []
            });

            // Sync down to history store as well so it shows on Dashboard
            const hStore = useHistoryStore.getState();
            hStore.saveResume({
              id: data.id || 'supabase-main',
              title: data.role || 'Main Resume',
              lastUpdated: Date.now(),
              data: {
                activeId: data.id || 'supabase-main',
                name: data.name || '',
                role: data.role || '',
                summary: data.summary || '',
                skills: data.skills || [],
                experience: data.experience || [],
                education: data.education || [],
                projects: data.projects || []
              }
            });
          }
        } catch (e) {
          console.error("Resume load error:", e);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (publicResumeId) {
    return <PublicProfile id={publicResumeId} />;
  }

  if (isInitializing) {
    return <div className="w-full h-screen bg-[#050505] flex items-center justify-center neon-glow"></div>;
  }

  if (!session) {
    return (
      <div className="w-full h-screen bg-[#050505] text-white font-body selection:bg-cyan-500/30 overflow-hidden relative">
        <AuthPage />
      </div>
    );
  }

  return (
    <AppLayout
      step={step === 'dashboard' ? 'upload' : step} // AppLayout expects 'upload' or 'editor' mostly for styling/split
      onGoHome={() => setStep('dashboard')}
      editor={
        step === 'dashboard'
          ? <Dashboard
            onCreateNew={() => setStep('upload')}
            onEditResume={(id, data) => {
              useResumeStore.getState().loadResume(id, data);
              setStep('editor');
            }}
          />
          : step === 'upload'
            ? <LandingUpload onUploadComplete={() => setStep('editor')} />
            : <CommandCenter />
      }
      preview={<DirectorsCut />}
    />
  );
}

export default App;
