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
    github_link?: string;
    image_url?: string;
    tags: string[];
    key_features?: string[];
}

export interface Social {
    id: string;
    platform: string;
    link: string;
}

export interface Achievement {
    id: string;
    title: string;
    event: string;
    date: string;
    description: string;
    link?: string;
}

export interface ResumeState {
    // Current Active Local Resume ID
    activeId: string | null;

    // Data
    name: string;
    role: string;
    summary: string;
    skills: string[];
    experience: Experience[];
    education: Education[];
    projects: Project[];
    socials: Social[];
    avatar_url: string;
    logo_url?: string;
    achievements: Achievement[];
    theme: string;

    // App State
    isSyncing: boolean;

    // Actions
    loadResume: (id: string, data: Partial<ResumeState>) => void;
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
            github_link: '',
            image_url: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80',
            key_features: ['Real-time inventory syncing', 'Secure Stripe checkouts'],
            tags: ['Next.js', 'Stripe', 'Tailwind']
        }
    ],
    avatar_url: '',
    logo_url: '',
    achievements: [
        {
            id: '1',
            title: 'First Place Winner',
            event: 'Global Hackathon',
            date: 'Oct 2023',
            description: 'Built an AI-powered resume builder overnight.',
            link: ''
        }
    ],
    socials: [
        {
            id: '1',
            platform: 'LinkedIn',
            link: 'https://linkedin.com/in/username'
        }
    ],
    theme: 'cyberpunk'
};

export const useResumeStore = create<ResumeState>((set, get) => ({
    ...initialData,
    activeId: null,
    isSyncing: false,

    loadResume: (id, data) => set((state) => ({ ...state, ...data, activeId: id })),

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
