import type { ReactNode } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { NeonBreadcrumb } from '../shared/NeonBreadcrumb';
import { useResumeStore } from '../../store/useResumeStore';
import { ImpactGauge } from '../shared/ImpactGauge';
import { ActionDock } from './ActionDock';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, RefreshCw } from 'lucide-react';

interface AppLayoutProps {
    editor: ReactNode;
    preview: ReactNode;
    step: 'upload' | 'editor';
    onGoHome?: () => void;
}

export function AppLayout({ editor, preview, step, onGoHome }: AppLayoutProps) {
    const isSyncing = useResumeStore((state) => state.isSyncing);

    return (
        <div className="min-h-screen bg-[var(--color-obsidian)] text-white relative overflow-hidden flex flex-col transition-colors duration-500">

            {/* Global Background Glow Effects */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px] mix-blend-screen" />
            </div>

            {/* Header / Nav */}
            <header className="fixed top-0 inset-x-0 h-16 z-50 flex items-center justify-between px-6 glass-panel border-b border-white/5">
                <div className="flex items-center space-x-4">
                    <div className="font-heading font-bold text-xl tracking-tight flex items-center">
                        Portfolio<span className="text-gradient">AI</span>
                    </div>
                    <div className="h-6 w-px bg-white/20 mx-4" />
                    <NeonBreadcrumb currentStep={step} />
                </div>

                <div className="flex items-center space-x-6">
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center text-xs font-medium text-white/60 bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
                        >
                            {isSyncing ? (
                                <>
                                    <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin text-cyan-400" />
                                    Syncing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-emerald-400" />
                                    Saved
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                    <ThemeSwitcher />
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 pt-16 flex h-screen overflow-hidden z-10 relative">
                {step === 'upload' ? (
                    <div className="w-full h-full flex items-center justify-center">
                        {editor}
                    </div>
                ) : (
                    <div className="w-full h-full flex">
                        {/* Split pane editor */}
                        <section className="w-1/2 h-full overflow-y-auto custom-scrollbar p-6 pb-32 relative z-20 print:hidden">
                            <div className="max-w-2xl mx-auto w-full">
                                {editor}
                            </div>
                        </section>

                        {/* Split pane preview */}
                        <section className="w-1/2 h-full bg-black/40 border-l border-white/5 overflow-y-auto relative p-8 pb-32 z-10">
                            <div className="fixed top-24 right-8 z-50">
                                <ImpactGauge />
                            </div>
                            <div className="w-full max-w-4xl mx-auto shadow-2xl glass-card min-h-[800px] overflow-hidden">
                                {preview}
                            </div>
                        </section>
                    </div>
                )}
            </main>

            {/* Global Dock for Editor */}
            {step === 'editor' && <ActionDock onGoHome={onGoHome} />}
        </div>
    );
}
