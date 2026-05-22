import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { Mail, Lock, ArrowRight, X, Construction } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Dynamic Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        x: [0, 100, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20 bg-primary"
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                        x: [0, -100, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-20 bg-light-blue"
                />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/40 overflow-hidden flex flex-col lg:flex-row relative z-10"
            >
                {/* Left Info Panel */}
                <div className="w-full lg:w-5/12 bg-text-primary p-8 lg:p-12 flex flex-col justify-between text-white relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                    </div>

                    <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center gap-2 group mb-12">
                            <div className="w-10 h-10 bg-primary rotate-45 rounded-xl flex items-center justify-center group-hover:rotate-90 transition-all duration-500">
                                <span className="text-white font-black text-xl -rotate-45 group-hover:-rotate-90 transition-all duration-500">C</span>
                            </div>
                            <span className="font-black text-xl tracking-tighter">Create<span className="text-primary">Good</span></span>
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                Welcome <span className="text-primary">back</span>.
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Secure, transparent, and high-impact crowdfunding for the visionaries of tomorrow. Continue your journey with us.
                            </p>
                        </motion.div>
                    </div>

                    <div className="relative z-10 pt-8 border-t border-white/10">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Platform Status</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm font-semibold">Systems Operational</span>
                        </div>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div className="w-full lg:w-7/12 p-8 lg:p-16 bg-white/40 flex flex-col justify-center">
                    <div className="mb-10">
                        <h3 className="text-3xl font-bold text-text-primary mb-2">Sign In</h3>
                        <p className="text-gray-500 font-medium">
                            Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Create one now</Link>
                        </p>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl font-medium text-sm flex items-center gap-3"
                        >
                            <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">!</div>
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/50 border-2 border-gray-100 focus:border-primary focus:bg-white outline-none py-4 pl-12 pr-4 rounded-2xl font-semibold transition-all placeholder:text-gray-300 text-text-primary"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Password</label>
                                <button 
                                    type="button"
                                    onClick={() => setShowForgotModal(true)}
                                    className="text-xs font-bold text-primary hover:underline"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                <input 
                                    type="password" 
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/50 border-2 border-gray-100 focus:border-primary focus:bg-white outline-none py-4 pl-12 pr-4 rounded-2xl font-semibold transition-all placeholder:text-gray-300 text-text-primary"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                disabled={loading}
                                className="w-full h-14 bg-text-primary text-white rounded-2xl font-bold hover:bg-black flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-text-primary/10 disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Authenticating...
                                    </div>
                                ) : (
                                    <>Sign In <ArrowRight size={20} className="text-primary" /></>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>

            {/* Forgot Password Modal */}
            <AnimatePresence>
                {showForgotModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowForgotModal(false)}
                            className="absolute inset-0 bg-text-primary/40 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 lg:p-10 overflow-hidden"
                        >
                            <div className="absolute top-6 right-6">
                                <button onClick={() => setShowForgotModal(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-text-primary hover:bg-gray-100 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6">
                                    <Construction className="text-primary" size={40} />
                                </div>
                                <h3 className="text-2xl lg:text-3xl font-bold text-text-primary mb-3">Feature Coming Soon</h3>
                                <p className="text-gray-500 font-medium leading-relaxed mb-8">
                                    The password recovery system is currently being built for maximum security. It will be available in a future update.
                                </p>
                                <button 
                                    onClick={() => setShowForgotModal(false)}
                                    className="w-full h-14 bg-primary text-white rounded-2xl font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20 uppercase tracking-widest text-xs"
                                >
                                    Got It
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Login;
