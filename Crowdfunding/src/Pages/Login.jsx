import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
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
        <div className="min-h-[calc(100vh-80px)] flex">
            {/* Left Side: Brand/Visual */}
            <div className="hidden lg:flex w-1/2 bg-custom-black relative overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-grad-yellow opacity-20"></div>
                    <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-custom-blue opacity-10 blur-[120px] rounded-full"></div>
                </div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-lg"
                >
                    <h1 className="text-6xl font-black text-custom-white leading-tight mb-8">
                        JOIN THE <span className="text-custom-yellow">REVOLUTION</span> OF GIVING.
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        Secure, transparent, and high-impact crowdfunding for the visionaries of tomorrow.
                    </p>
                </motion.div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 bg-custom-white flex items-center justify-center p-8 sm:p-12">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-12">
                        <h2 className="text-4xl font-black text-custom-black mb-2">Welcome Back</h2>
                        <p className="text-gray-500 font-medium">Don't have an account? <Link to="/register" className="text-custom-blue hover:underline">Sign up for free</Link></p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 font-bold text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-custom-yellow transition-colors" size={20} />
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow focus:bg-white outline-none py-4 pl-12 pr-4 rounded-2xl font-bold transition-all text-custom-black"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Password</label>
                                <Link to="/forgot-password" title="Forgot Password" className="text-xs font-bold text-custom-blue">Forgot Password?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-custom-yellow transition-colors" size={20} />
                                <input 
                                    type="password" 
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow focus:bg-white outline-none py-4 pl-12 pr-4 rounded-2xl font-bold transition-all text-custom-black"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button 
                            disabled={loading}
                            className="w-full bg-custom-black hover:bg-gray-900 text-custom-white py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10 active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                            {!loading && <ArrowRight size={20} className="text-custom-yellow" />}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
