import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white text-text-primary pt-16 pb-8 border-t border-border-light">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center group gap-0">
                            <div className="relative w-10 h-10 flex items-center justify-center">
                                <div className="absolute inset-0 bg-primary rotate-45 rounded-xl group-hover:rotate-90 transition-all duration-500 shadow-lg shadow-primary/20"></div>
                                <span className="relative z-10 text-white font-black text-xl tracking-tighter">C</span>
                            </div>
                            <div className="relative w-10 h-10 -ml-3 flex items-center justify-center">
                                <div className="absolute inset-0 bg-text-primary -rotate-12 rounded-xl group-hover:rotate-0 transition-all duration-500 shadow-lg shadow-text-primary/10 border border-white/20"></div>
                                <span className="relative z-10 text-white font-black text-xl tracking-tighter">G</span>
                            </div>
                            <span className="ml-3 text-lg font-black text-text-primary tracking-tighter">
                                Create<span className="text-primary">Good</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
                            The thoughtful way to fund creative projects and support causes that matter. Join our community and create good today.
                        </p>
                        <div className="flex space-x-3">
                            {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                                <a key={social} href="#" className="w-10 h-10 rounded-lg bg-background border border-border-light flex items-center justify-center hover:bg-cream transition-all">
                                    <span className="sr-only">{social}</span>
                                    <div className="w-3 h-3 bg-gray-400 rounded-sm"></div> {/* Placeholder icon */}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 text-gray-400">Find Your Path</h3>
                        <ul className="space-y-4 text-text-primary text-[10px] font-bold uppercase tracking-widest">
                            <li><Link to="/explore" className="hover:text-primary transition-colors">Design & Tech</Link></li>
                            <li><Link to="/explore" className="hover:text-primary transition-colors">Arts & Culture</Link></li>
                            <li><Link to="/explore" className="hover:text-primary transition-colors">Social Impact</Link></li>
                            <li><Link to="/explore" className="hover:text-primary transition-colors">Games & Apps</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 text-gray-400">How We Help</h3>
                        <ul className="space-y-4 text-text-primary text-[10px] font-bold uppercase tracking-widest">
                            <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link to="/rules" className="hover:text-primary transition-colors">Our Rules</Link></li>
                            <li><Link to="/trust" className="hover:text-primary transition-colors">Trust & Safety</Link></li>
                            <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Use</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 text-gray-400">Stay Connected</h3>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">Subscribe to our newsletter.</p>
                        <form className="flex flex-col space-y-3">
                            <input 
                                type="email" 
                                placeholder="Your email address" 
                                className="bg-background border border-border-light rounded-lg px-4 py-3 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-colors text-text-primary"
                            />
                            <button className="bg-primary text-white px-4 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all">
                                Stay Updated
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-border-light flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        © 2026 Create Good Inc.
                    </p>
                    
                    {/* Payment Methods */}
                    <div className="flex items-center gap-6">
                        <span className="text-gray-400 text-[8px] font-bold uppercase tracking-[0.3em]">Secure Payments</span>
                        <div className="flex gap-6 items-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
                            <div className="text-text-primary font-bold italic text-xs">PayPal</div>
                            <div className="text-text-primary font-bold text-xs uppercase">stripe</div>
                            <div className="text-text-primary font-extrabold text-xs tracking-tighter">SSL<span className="text-primary">C</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
