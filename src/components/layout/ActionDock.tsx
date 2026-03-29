import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Rocket, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function ActionDock() {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        // Open the blank tab synchronously to prevent popup blockers
        const newWindow = window.open('', '_blank');

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.id) {
                const publicUrl = `${window.location.origin}/?p=${session.user.id}`;

                // Navigate the new tab to the actual url
                if (newWindow) newWindow.location.href = publicUrl;

                try {
                    // Copy to clipboard (might fail if permissions are denied)
                    await navigator.clipboard.writeText(publicUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                } catch (clipboardErr) {
                    console.warn("Clipboard copy failed, but window opened.", clipboardErr);
                }
            } else {
                if (newWindow) newWindow.close();
            }
        } catch (err) {
            if (newWindow) newWindow.close();
        }
    };

    const handleDownload = () => {
        window.print();
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

                {/* Publish / Share Link */}
                <div className="relative">
                    <button
                        onClick={handleShare}
                        className="flex justify-center items-center p-0 w-14 h-14 rounded-full text-white/70 hover:text-purple-300 hover:bg-white/5 hover:scale-110 active:scale-95 transition-all outline-none"
                        title="Copy Public Profile Link"
                    >
                        {copied ? <CheckCircle2 className="w-5 h-5 text-green-400 pointer-events-none" /> : <Rocket className="w-5 h-5 pointer-events-none" />}
                    </button>

                    <AnimatePresence>
                        {copied && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                className="absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold rounded-lg shadow-lg whitespace-nowrap backdrop-blur-xl"
                            >
                                Live Link Copied!
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
