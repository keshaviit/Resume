import { create } from 'zustand';

export interface Experience {
    id: string;
    company: string;
    role: string;
    date: string;
    description: string;
}

export interface Education {
    id: string;
    school: string;
    degree: string;
    date: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    link: string;
    tags: string[];
}

export interface ResumeState {
    // Data
    name: string;
    role: string;
    summary: string;
    skills: string[];
    experience: Experience[];
    education: Education[];
    projects: Project[];

    // App State
    isSyncing: boolean;

    // Actions
    updateField: (field: string, value: any) => void;
    setSyncing: (status: boolean) => void;
    getImpactScore: () => number;
}

const initialData = {
    name: 'Alex Developer',
    role: 'Software Engineer',
    summary: 'Passionate software engineer with a focus on building scalable web applications. I love creating engaging user experiences with modern technologies.',
    skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
    experience: [
        {
            id: '1',
            company: 'Tech Innovators Inc.',
            role: 'Frontend Engineer',
            date: 'Jan 2021 - Present',
            description: 'Led the development of the core product dashboard using React and Redux, improving load times by 40%.'
        }
    ],
    education: [
        {
            id: '1',
            school: 'University of Technology',
            degree: 'B.S. Computer Science',
            date: '2016 - 2020'
        }
    ],
    projects: [
        {
            id: '1',
            title: 'E-Commerce Platform',
            description: 'A full-stack e-commerce solution with Next.js and Stripe integration.',
            link: '#',
            tags: ['Next.js', 'Stripe', 'Tailwind']
        }
    ]
};

export const useResumeStore = create<ResumeState>((set, get) => ({
    ...initialData,
    isSyncing: false,

    updateField: (field, value) => set((state) => ({ ...state, [field]: value })),

    setSyncing: (status) => set({ isSyncing: status }),

    getImpactScore: () => {
        const state = get();
        let score = 0;

        // Core logic for Impact Score
        if (state.summary.length > 50) score += 20;

        score += state.projects.length * 15;
        score += state.experience.length * 10;
        score += state.skills.length * 5;

        return Math.min(score, 100);
    }
}));
