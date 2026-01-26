import React, { useState } from 'react';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { LogIn, Lock, Mail, Star } from 'lucide-react';

const AdminLogin = () => {
    const [user, loadingAuth] = useAuthState(auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user || auth.currentUser) {
            navigate('/admin');
        }
    }, [user, navigate]);

    if (loadingAuth) {
        return (
            <div className="fixed inset-0 min-h-screen flex items-center justify-center bg-[#020617] z-[9999]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent-primary"></div>
            </div>
        );
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin');
        } catch (err) {
            console.error("Login error:", err);
            setError("Sai email hoặc mật khẩu. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] cursor-auto relative">
            <div className="max-w-md w-full bg-[#0A192F] border border-white/5 p-10 rounded-[2.5rem] relative z-10 shadow-2xl">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-accent-primary/10 flex items-center justify-center text-accent-primary mb-6">
                        <Star size={24} fill="currentColor" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">Admin Access</h1>
                    <p className="text-text-secondary text-sm font-light opacity-60">Manage your digital presence</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60 ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary opacity-40 group-focus-within:text-accent-primary group-focus-within:opacity-100 transition-all" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent-primary/30 focus:bg-white/[0.08] transition-all font-sans"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-accent-primary opacity-60 ml-1">Mật khẩu</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary opacity-40 group-focus-within:text-accent-primary group-focus-within:opacity-100 transition-all" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent-primary/30 focus:bg-white/[0.08] transition-all font-sans"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center animate-fade-in-up">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-pill py-4 flex items-center justify-center gap-3 bg-accent-primary text-bg-primary font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-none shadow-[0_10px_30px_rgba(0,229,255,0.2)]"
                    >
                        {loading ? "Đang xử lý..." : "Đăng nhập"}
                        {!loading && <LogIn size={18} />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
