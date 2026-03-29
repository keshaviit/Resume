import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export function AuthPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                // Determine the URL depending on local dev vs production Vercel
                emailRedirectTo: window.location.origin
            }
        });

        if (error) {
            setError(error.message);
        } else {
            setSent(true);
        }
        setLoading(false);
    };

    return (
        <div className="w-full flex items-center justify-center min-h-[60vh] px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 glass-panel rounded-3xl border border-white/10 relative overflow-hidden"
            >
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/20 blur-[80px] pointer-events-none" />
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-cyan-500/20 blur-[80px] pointer-events-none" />

                <div className="relative z-10">
                    <h2 className="text-3xl font-heading font-bold mb-2">Welcome Back</h2>
                    <p className="text-white/60 mb-8">Sign in or create an account to save your PortfolioAI project securely.</p>

                    {sent ? (
                        <div className="space-y-6 text-center py-6">
                            <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-10 h-10 text-green-400" />
                            </div>
                            <h3 className="text-xl font-medium">Magic Link Sent!</h3>
                            <p className="text-white/50 text-sm">We've sent a secure login link to <strong>{email}</strong>. Check your inbox to sign in instantly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-white/30" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all text-white placeholder-white/30"
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-400 text-sm mt-2 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all flex items-center justify-center group disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : 'Send Magic Link'}
                                {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                            </button>
                            <p className="text-center text-xs text-white/40 mt-6 leading-relaxed">
                                Supabase will verify your email securely.
                                No passwords required.
                            </p>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
