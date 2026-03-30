import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ResumeState } from './useResumeStore';

export interface SavedResume {
    id: string; // unique local ID
    title: string; // e.g., role or filename
    lastUpdated: number; // timestamp
    data: Omit<ResumeState, 'isSyncing' | 'updateField' | 'setSyncing' | 'getImpactScore' | 'loadResume'>;
}

interface HistoryState {
    resumes: SavedResume[];
    saveResume: (resume: SavedResume) => void;
    deleteResume: (id: string) => void;
}

export const useHistoryStore = create<HistoryState>()(
    persist(
        (set) => ({
            resumes: [],
            saveResume: (resume) => set((state) => {
                const exists = state.resumes.find(r => r.id === resume.id);
                if (exists) {
                    return {
                        resumes: state.resumes.map(r => r.id === resume.id ? { ...resume, lastUpdated: Date.now() } : r).sort((a, b) => b.lastUpdated - a.lastUpdated)
                    };
                }
                return { resumes: [{ ...resume, lastUpdated: Date.now() }, ...state.resumes].sort((a, b) => b.lastUpdated - a.lastUpdated) };
            }),
            deleteResume: (id) => set((state) => ({
                resumes: state.resumes.filter(r => r.id !== id)
            }))
        }),
        { name: 'resume-ai-history' }
    )
);
