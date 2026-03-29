import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, BrainCircuit } from 'lucide-react';

interface Props {
    onUploadComplete: () => void;
}

export function LandingUpload({ onUploadComplete }: Props) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadState, setUploadState] = useState<'idle' | 'parsing' | 'done'>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    const messages = [
        "Analyzing professional impact...",
        "Extracting key achievements...",
        "Structuring your narrative...",
        "Applying Digital Obsidian theme..."
    ];

    useEffect(() => {
        let interval: any;
        if (uploadState === 'parsing') {
            let i = 0;
            setStatusMessage(messages[0]);
            interval = setInterval(() => {
                i++;
                if (i < messages.length) {
                    setStatusMessage(messages[i]);
                } else {
                    i = 0; // Loop the messages while waiting for Gemini
                }
            }, 1500);
        }
        return () => clearInterval(interval);
    }, [uploadState]);

    const handleActualUpload = async (file: File) => {
        setUploadState('parsing');
        try {
            // Dynamically import to avoid loading heavy SDKs on initial page load if possible
            const { parseResumeWithGemini } = await import('../../lib/gemini');
            await parseResumeWithGemini(file);

            // Success
            setUploadState('done');
            setTimeout(() => onUploadComplete(), 800);
        } catch (error: any) {
            console.error("Upload failure:", error);
            alert("Parsing failed: " + error.message);
            setUploadState('idle');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleActualUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleActualUpload(e.target.files[0]);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center relative z-10">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight">
                    Craft Your <span className="text-gradient">Legacy</span>
                </h1>
                <p className="text-lg text-white/60 max-w-xl mx-auto">
                    Upload your resume. Our Neural Engine will instantly forge it into a high-end, interactive digital portfolio.
                </p>
            </motion.div>

            <AnimatePresence mode="wait">
                {uploadState === 'idle' ? (
                    <motion.div
                        key="dropzone"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('resume-upload')?.click()}
                        className={`w-full h-80 relative flex flex-col items-center justify-center rounded-[2rem] border-2 transition-all duration-300 cursor-pointer overflow-hidden ${isDragging
                            ? 'border-purple-500 bg-white/10 neon-glow'
                            : 'border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                            }`}
                    >
                        <input
                            type="file"
                            id="resume-upload"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleFileChange}
                        />
                        {/* Animated Concentric Circles Background */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute w-40 h-40 border border-purple-500 rounded-full"
                            />
                            <motion.div
                                animate={{ scale: [1, 2, 1], opacity: [0.2, 0.05, 0.2] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                                className="absolute w-64 h-64 border border-cyan-500 rounded-full"
                            />
                        </div>

                        <div className="relative z-10 flex flex-col items-center pointer-events-none">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 flex items-center justify-center mb-6 backdrop-blur-md border border-white/10">
                                <UploadCloud className="w-8 h-8 text-cyan-300" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-2">Drop your resume here</h3>
                            <p className="text-white/40">PDF, DOCX, or TXT (Max 5MB)</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="parsing"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full h-80 flex flex-col items-center justify-center glass-panel rounded-[2rem] relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 mix-blend-screen" />

                        {/* AI Brain Pulse */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                            className="relative w-32 h-32 mb-8 flex items-center justify-center"
                        >
                            <BrainCircuit className="w-12 h-12 text-purple-400 absolute z-10" />
                            <motion.div
                                animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="absolute inset-0 border-2 border-cyan-400 rounded-full"
                            />
                            <motion.div
                                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
                                className="absolute inset-0 border-2 border-purple-500 rounded-full"
                            />
                        </motion.div>

                        <motion.h3
                            key={statusMessage}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300"
                        >
                            {statusMessage}
                        </motion.h3>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
