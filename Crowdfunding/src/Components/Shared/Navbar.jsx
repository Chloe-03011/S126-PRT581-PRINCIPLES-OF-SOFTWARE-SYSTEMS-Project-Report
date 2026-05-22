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
        { name: 'Impact Stories', path: '/stories' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="bg-white text-text-primary sticky top-0 z-50 border-b border-border-light backdrop-blur-md bg-opacity-90">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center group gap-0">
                            <div className="relative w-12 h-12 flex items-center justify-center">
                                <div className="absolute inset-0 bg-primary rotate-45 rounded-xl group-hover:rotate-90 transition-all duration-500 shadow-lg shadow-primary/20"></div>
                                <span className="relative z-10 text-white font-black text-2xl tracking-tighter">C</span>
                            </div>
                            <div className="relative w-12 h-12 -ml-4 flex items-center justify-center">
                                <div className="absolute inset-0 bg-text-primary -rotate-12 rounded-xl group-hover:rotate-0 transition-all duration-500 shadow-lg shadow-text-primary/10 border border-white/20"></div>
                                <span className="relative z-10 text-white font-black text-2xl tracking-tighter">G</span>
                            </div>
                            <span className="ml-3 text-xl font-black text-text-primary tracking-tighter hidden sm:block">
                                Create<span className="text-primary">Good</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-6">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-all relative group ${
                                            isActive ? 'text-primary' : 'text-gray-400 hover:text-text-primary'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            {link.name}
                                            <span className={`absolute bottom-0 left-3 right-3 h-0.5 bg-primary transition-all ${isActive ? 'w-[calc(100%-1.5rem)]' : 'w-0 group-hover:w-[calc(100%-1.5rem)]'}`}></span>
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/create-campaign" className="bg-white border border-border-light hover:bg-background text-text-primary px-5 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2">
                            <PlusCircle size={16} className="text-primary" />
                            Start a Project
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <NotificationBell />
                                
                                <div className="relative">
                                    <button 
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 bg-background px-4 py-2 rounded-lg hover:bg-gray-100 transition-all border border-border-light shadow-sm"
                                    >
                                        <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs">
                                            {user.name.charAt(0)}
                                        </div>
                                        <span className="text-[10px] font-bold text-text-primary uppercase tracking-widest">Welcome, {user.name.split(' ')[0]}</span>
                                    </button>

                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-3 w-56 bg-white border border-border-light rounded-lg shadow-sm py-2 overflow-hidden">
                                            <div className="px-4 py-3 border-b border-border-light bg-background">
                                                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Signed in as</p>
                                                <p className="text-xs font-bold text-text-primary truncate">{user.email}</p>
                                            </div>
                                            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-background transition-colors text-gray-500 hover:text-primary">
                                                <LayoutDashboard size={14} />
                                                My Dashboard
                                            </Link>
                                            <Link to={`/creator/${user.id || user._id}`} className="flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-background transition-colors text-gray-500 hover:text-primary">
                                                <User size={14} />
                                                Profile
                                            </Link>
                                            <Link to="/dashboard?tab=settings" className="flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-background transition-colors text-gray-500 hover:text-primary">
                                                <Settings size={14} />
                                                Settings
                                            </Link>
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 transition-colors text-red-500"
                                            >
                                                <LogOut size={14} />
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            ) : (
                            <Link to="/login" className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all hover:opacity-90">
                                Log In
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-text-primary hover:bg-background focus:outline-none border border-border-light shadow-sm"
                        >
                            {isOpen ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white border-b border-border-light animate-in fade-in slide-in-from-top-4 duration-300`}>
                <div className="px-4 pt-4 pb-8 space-y-2">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest ${
                                    isActive ? 'text-primary bg-background' : 'text-gray-400 hover:text-text-primary'
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                    <div className="pt-4 flex flex-col gap-3">
                        {user ? (
                            <button 
                                onClick={handleLogout}
                                className="w-full bg-red-50 text-red-500 px-3 py-4 rounded-lg font-bold text-xs uppercase tracking-widest text-center"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <Link 
                                to="/login" 
                                onClick={() => setIsOpen(false)}
                                className="w-full bg-primary text-white px-3 py-4 rounded-lg font-bold text-xs uppercase tracking-widest text-center"
                            >
                                Log In
                            </Link>
                        )}
                        <Link 
                            to="/create-campaign" 
                            onClick={() => setIsOpen(false)}
                            className="w-full bg-white border border-border-light text-text-primary px-3 py-4 rounded-lg font-bold text-xs uppercase tracking-widest text-center shadow-sm"
                        >
                            Start a Project
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
