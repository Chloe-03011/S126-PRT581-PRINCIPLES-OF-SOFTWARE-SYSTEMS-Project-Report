import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';
import { User, LogOut, LayoutDashboard, Settings, PlusCircle } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Auto-close profile menu after 3 seconds
    useEffect(() => {
        let timer;
        if (isProfileOpen) {
            timer = setTimeout(() => {
                setIsProfileOpen(false);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [isProfileOpen]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Explore', path: '/explore' },
        { name: 'How it Works', path: '/how-it-works' },
        { name: 'Success Stories', path: '/stories' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="bg-custom-black text-custom-white sticky top-0 z-50 border-b border-gray-800 backdrop-blur-md bg-opacity-90">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-custom-yellow rounded-full flex items-center justify-center transition-transform group-hover:rotate-12">
                                <div className="w-5 h-5 bg-custom-black rounded-sm rotate-45"></div>
                            </div>
                            <span className="text-custom-white">CROWD<span className="text-custom-yellow group-hover:text-custom-blue transition-colors">FUND</span></span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `px-3 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-all relative group ${
                                            isActive ? 'text-custom-yellow' : 'text-gray-400 hover:text-custom-white'
                                        }`
                                    }
                                >
                                    {link.name}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-custom-yellow transition-all group-hover:w-full"></span>
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/create-campaign" className="bg-transparent border border-white/20 hover:bg-white/5 text-custom-white px-5 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 active:scale-95">
                            <PlusCircle size={18} className="text-custom-yellow" />
                            Start a Campaign
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <NotificationBell />
                                
                                <div className="relative">
                                    <button 
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-full hover:bg-gray-800 transition-all border border-white/10"
                                    >
                                    <div className="w-8 h-8 rounded-full bg-custom-blue flex items-center justify-center text-custom-white font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-bold">{user.name.split(' ')[0]}</span>
                                        </button>

                                        {isProfileOpen && (
                                            <div className="absolute right-0 mt-3 w-56 bg-custom-black border border-gray-800 rounded-2xl shadow-2xl py-2 overflow-hidden backdrop-blur-xl bg-opacity-95">
                                                <div className="px-4 py-3 border-b border-gray-800">
                                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Signed in as</p>
                                                    <p className="text-sm font-bold text-custom-white truncate">{user.email}</p>
                                                </div>
                                                <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-white/5 transition-colors text-gray-300 hover:text-custom-yellow">
                                                    <LayoutDashboard size={18} />
                                                    Dashboard
                                                </Link>
                                                <Link to={`/creator/${user.id || user._id}`} className="flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-white/5 transition-colors text-gray-300 hover:text-custom-yellow">
                                                    <User size={18} />
                                                    My Profile
                                                </Link>
                                                <Link to="/dashboard?tab=settings" className="flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-white/5 transition-colors text-gray-300 hover:text-custom-yellow">
                                                    <Settings size={18} />
                                                    Settings
                                                </Link>
                                                <button 
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-red-500/10 transition-colors text-red-500"
                                                >
                                                    <LogOut size={18} />
                                                    Sign Out
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                            <Link to="/login" className="bg-custom-yellow hover:brightness-110 text-custom-black px-8 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-yellow-500/20 active:scale-95">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-custom-white hover:bg-gray-800 focus:outline-none"
                        >
                            {isOpen ? (
                                <svg className="block h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-custom-black border-b border-gray-800 animate-in fade-in slide-in-from-top-4 duration-300`}>
                <div className="px-4 pt-4 pb-8 space-y-4">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-xl text-lg font-bold ${
                                    isActive ? 'text-custom-yellow bg-white/5' : 'text-gray-300 hover:text-custom-white'
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                    <div className="pt-4 flex flex-col gap-4">
                        {user ? (
                            <button 
                                onClick={handleLogout}
                                className="w-full bg-white/5 text-red-500 px-6 py-4 rounded-xl font-bold text-lg text-center"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <Link 
                                to="/login" 
                                onClick={() => setIsOpen(false)}
                                className="w-full bg-custom-yellow text-custom-black px-6 py-4 rounded-xl font-bold text-lg text-center"
                            >
                                Login
                            </Link>
                        )}
                        <Link 
                            to="/create-campaign" 
                            onClick={() => setIsOpen(false)}
                            className="w-full border border-white/20 text-custom-white px-6 py-4 rounded-xl font-bold text-lg text-center"
                        >
                            Start a Campaign
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;