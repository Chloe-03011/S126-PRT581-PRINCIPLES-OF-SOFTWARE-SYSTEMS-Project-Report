import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-custom-black text-custom-white pt-16 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2">
                            <div className="w-8 h-8 bg-custom-yellow rounded-full flex items-center justify-center">
                                <div className="w-4 h-4 bg-custom-black rounded-sm rotate-45"></div>
                            </div>
                            <span className="text-custom-white">CROWD<span className="text-custom-yellow">FUND</span></span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Empowering creators and donors to bring meaningful projects to life. Join our global community today.
                        </p>
                        <div className="flex space-x-4">
                            {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                                <a key={social} href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-custom-yellow hover:text-custom-black transition-all">
                                    <span className="sr-only">{social}</span>
                                    <div className="w-4 h-4 bg-current rounded-sm"></div> {/* Placeholder icon */}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-custom-white">Explore</h3>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><Link to="/explore" className="hover:text-custom-yellow transition-colors">Design & Tech</Link></li>
                            <li><Link to="/explore" className="hover:text-custom-yellow transition-colors">Arts & Culture</Link></li>
                            <li><Link to="/explore" className="hover:text-custom-yellow transition-colors">Social Impact</Link></li>
                            <li><Link to="/explore" className="hover:text-custom-yellow transition-colors">Games & Apps</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-custom-white">Support</h3>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><Link to="/help" className="hover:text-custom-yellow transition-colors">Help Center</Link></li>
                            <li><Link to="/rules" className="hover:text-custom-yellow transition-colors">Our Rules</Link></li>
                            <li><Link to="/trust" className="hover:text-custom-yellow transition-colors">Trust & Safety</Link></li>
                            <li><Link to="/terms" className="hover:text-custom-yellow transition-colors">Terms of Use</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-custom-white">Stay Updated</h3>
                        <p className="text-gray-400 text-sm mb-4">Subscribe to receive the best projects in your inbox.</p>
                        <form className="flex flex-col space-y-3">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-custom-yellow transition-colors text-custom-white"
                            />
                            <button className="bg-custom-yellow text-custom-black px-4 py-2.5 rounded-lg font-bold text-sm hover:brightness-110 transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-xs">
                        © 2026 Crowdfund Inc. Built with passion for creators.
                    </p>
                    
                    {/* Payment Methods */}
                    <div className="flex items-center gap-6">
                        <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Secure Payments</span>
                        <div className="flex gap-4 items-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                            {/* PayPal */}
                            <div className="text-custom-white font-bold italic text-sm">PayPal</div>
                            {/* Stripe */}
                            <div className="text-custom-white font-bold text-sm">stripe</div>
                            {/* SSL Commerz */}
                            <div className="text-custom-white font-extrabold text-sm tracking-tighter">SSL<span className="text-custom-yellow">C</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;