import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Rocket, Share2, CheckCircle2 } from 'lucide-react';

export function ActionDock() {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) { }
    };

    const handleDownload = () => {
        window.print();
    };

    const handleDeploy = () => {
        window.open('https://vercel.com/new', '_blank');
    };

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 print:hidden"
        >
            <div className="flex items-center gap-2 p-2 rounded-[2rem] glass-card border border-white/10 bg-black/60 shadow-[0_0_30px_rgba(34,211,238,0.15)] backdrop-blur-3xl transition-all hover:bg-black/80 hover:border-white/20 hover:shadow-[0_0_40px_rgba(34,211,238,0.25)]">

                {/* Download PDF */}
                <button
                    onClick={handleDownload}
                    className="p-4 rounded-full text-white/70 hover:text-cyan-300 hover:bg-white/5 hover:scale-110 active:scale-95 transition-all outline-none"
                    title="Export as PDF"
                >
                    <Download className="w-5 h-5 pointer-events-none" />
                </button>

                {/* Deploy */}
                <button
                    onClick={handleDeploy}
                    className="flex justify-center items-center p-0 w-14 h-14 rounded-full text-white/70 hover:text-purple-300 hover:bg-white/5 hover:scale-110 active:scale-95 transition-all outline-none relative"
                    title="Publish to Vercel"
                >
                    <Rocket className="w-5 h-5 pointer-events-none" />
                </button>

                {/* Share Link */}
                <div className="relative">
                    <button
                        onClick={handleShare}
                        className="p-4 rounded-full text-white/70 hover:text-green-300 hover:bg-white/5 hover:scale-110 active:scale-95 transition-all outline-none"
                        title="Copy Public Link"
                    >
                        {copied ? <CheckCircle2 className="w-5 h-5 text-green-400 pointer-events-none" /> : <Share2 className="w-5 h-5 pointer-events-none" />}
                    </button>

                    <AnimatePresence>
                        {copied && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                className="absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-bold rounded-lg shadow-lg whitespace-nowrap backdrop-blur-xl"
                            >
                                Copied Link!
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
