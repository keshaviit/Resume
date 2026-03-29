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

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [step, setStep] = useState<'upload' | 'editor'>('upload');
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
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      if (session) {
        try {
          const { data, error } = await supabase.from('resumes').select('*').eq('user_id', session.user.id).maybeSingle();
          if (data && !error) {
            const { updateField } = useResumeStore.getState();
            if (data.name) updateField('name', data.name);
            if (data.role) updateField('role', data.role);
            if (data.summary) updateField('summary', data.summary);
            if (data.skills) updateField('skills', data.skills);
            if (data.experience) updateField('experience', data.experience);
            if (data.education) updateField('education', data.education);
            if (data.projects) updateField('projects', data.projects);
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
      step={step}
      editor={
        step === 'upload'
          ? <LandingUpload onUploadComplete={() => setStep('editor')} />
          : <CommandCenter />
      }
      preview={<DirectorsCut />}
    />
  );
}

export default App;
