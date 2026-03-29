import React from 'react';
import { motion } from 'framer-motion';

interface Props {
    currentStep: 'upload' | 'editor';
}

export function NeonBreadcrumb({ currentStep }: Props) {
    const steps = [
        { id: 'upload', label: 'Upload' },
        { id: 'editor', label: 'Edit' },
        { id: 'preview', label: 'Preview' }
    ];

    const currentIndex = steps.findIndex(s => s.id === currentStep);

    return (
        <div className="flex items-center space-x-2 text-sm font-medium">
            {steps.map((step, idx) => {
                const isActive = idx === currentIndex || (currentStep === 'editor' && step.id === 'preview'); // preview and editor are side by side
                const isPast = idx < currentIndex;

                return (
                    <React.Fragment key={step.id}>
                        <div className="relative flex items-center group">
                            <span className={`transition-colors duration-300 ${isActive || isPast ? 'text-white' : 'text-white/30'}`}>
                                {step.label}
                            </span>
                            {(isActive || isPast) && (
                                <motion.div
                                    layoutId="active-breadcrumb-glow"
                                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full neon-glow"
                                />
                            )}
                        </div>
                        {idx < steps.length - 1 && (
                            <span className="text-white/20 mx-2">/</span>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
