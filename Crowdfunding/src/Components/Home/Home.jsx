import React, { useEffect, useState } from 'react';
import CampaignCard from '../Shared/CampaignCard';
import api from '../../api/axios';
import { motion } from 'framer-motion';

const Home = () => {
    const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await api.get('/campaigns?limit=3');
                setFeaturedCampaigns(response.data);
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, []);

    return (
        <div className="overflow-hidden bg-custom-white">
            {/* Hero Section */}
            <section className="relative bg-custom-black text-custom-white py-24 lg:py-32">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-custom-yellow bg-opacity-10 blur-[120px] rounded-full"></div>
                    <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-custom-blue bg-opacity-10 blur-[120px] rounded-full"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
                        BRING YOUR <span className="text-custom-yellow underline decoration-custom-blue underline-offset-8 decoration-4">VISION</span> TO LIFE
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        The world's most innovative crowdfunding platform for creative rewards and charitable donations.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <button className="w-full sm:w-auto bg-custom-white hover:bg-gray-100 text-custom-black px-10 py-5 rounded-full font-black text-lg transition-all shadow-xl shadow-white/10 active:scale-95">
                            Back a Reward Project
                        </button>
                        <button className="w-full sm:w-auto bg-transparent hover:bg-white/5 border-2 border-white/20 px-10 py-5 rounded-full font-black text-lg transition-all active:scale-95 text-custom-white">
                            Make a Donation
                        </button>
                    </div>
                </div>
            </section>

            {/* Crowdfunding Models Section */}
            <section className="py-24 bg-custom-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-custom-black mb-4">Choose Your Path</h2>
                        <p className="text-gray-500">We offer two distinct ways to fund your dreams.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Reward Based Card: Yellow Background */}
                        <div className="p-10 rounded-3xl bg-custom-yellow border border-black/5 hover:border-black/30 transition-all group">
                            <div className="w-16 h-16 bg-custom-black rounded-2xl flex items-center justify-center mb-8 transform transition-transform group-hover:rotate-12">
                                <svg className="w-8 h-8 text-custom-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>
                            </div>
                            <h3 className="text-3xl font-black text-custom-black mb-4">Reward Based</h3>
                            <p className="text-custom-black text-opacity-70 mb-8 leading-relaxed">
                                Fuel the next generation of innovation. Support visionary creators and secure exclusive perks, early-bird access, and one-of-a-kind physical rewards. Your commitment only triggers on an <span className="font-bold text-custom-black italic underline decoration-black/20">All or Nothing</span> basis—ensuring every project is fully powered to succeed.
                            </p>
                            <div className="flex items-center gap-6 mb-8 py-4 border-y border-black border-opacity-10">
                                <span className="text-[10px] font-bold text-custom-black text-opacity-40 uppercase tracking-widest">Supported Methods</span>
                                <div className="flex gap-4 opacity-70">
                                    <span className="font-bold italic text-sm text-custom-black">PayPal</span>
                                    <span className="font-bold text-sm text-custom-black">stripe</span>
                                </div>
                            </div>
                            <button className="text-custom-black font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                                Learn about Rewards <span>→</span>
                            </button>
                        </div>

                        {/* Donation Based Card: Sky Blue Background */}
                        <div className="p-10 rounded-3xl bg-custom-blue border border-black/5 hover:border-black/30 transition-all group">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 transform transition-transform group-hover:rotate-12">
                                <svg className="w-8 h-8 text-custom-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-3xl font-black text-custom-white mb-4">Donation Based</h3>
                            <p className="text-custom-white text-opacity-90 mb-8 leading-relaxed">
                                Empower a cause that matters or support a life in need. Every dollar you give goes directly to the heart of the mission, with no minimum threshold to meet. Whether it’s a medical emergency or a community dream, your generosity makes an immediate impact under our <span className="font-bold text-custom-white italic underline decoration-white/20">Keep it All</span> model.
                            </p>
                            <div className="flex items-center gap-6 mb-8 py-4 border-y border-custom-white border-opacity-20">
                                <span className="text-[10px] font-bold text-custom-white text-opacity-60 uppercase tracking-widest">Supported Methods</span>
                                <div className="flex gap-4 opacity-90">
                                    <span className="font-bold italic text-sm text-custom-white">PayPal</span>
                                    <span className="font-bold text-sm text-custom-white">stripe</span>
                                    <span className="font-extrabold text-sm tracking-tighter text-custom-white">SSL<span className="text-custom-yellow">C</span></span>
                                </div>
                            </div>
                            <button className="text-custom-white font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                                Start Donating <span>→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Campaigns Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <h2 className="text-4xl font-black text-custom-black mb-4">Trending Campaigns</h2>
                            <p className="text-gray-500">Discover projects that are making an impact right now.</p>
                        </div>
                        <button className="bg-custom-black text-custom-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-custom-yellow hover:text-custom-black transition-all">
                            View All Projects
                        </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {featuredCampaigns.map((campaign) => (
                            <CampaignCard 
                                key={campaign._id} 
                                _id={campaign._id}
                                title={campaign.title}
                                category={campaign.category}
                                type={campaign.campaignType === 'reward' ? 'Reward' : 'Donation'}
                                raised={campaign.totalRaised}
                                goal={campaign.fundingGoal}
                                image={campaign.thumbnail}
                                daysLeft={Math.max(0, Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)))}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Payment Partner Strip */}
            <section className="py-12 bg-custom-black overflow-hidden border-y border-gray-900">
                <div className="flex lg:flex-row flex-col items-center justify-around gap-12 animate-flicker-random">
                    <div className="text-white text-opacity-60 font-bold text-2xl italic tracking-tighter">Trusted By Global Partners</div>
                    <div className="flex lg:flex-row flex-col items-center gap-12 opacity-60 hover:opacity-100 transition-opacity">
                        <div className="text-custom-white font-black text-3xl">stripe</div>
                        <div className="text-custom-white font-bold italic text-3xl">PayPal</div>
                        <div className="text-custom-white font-black text-3xl tracking-tighter">SSL<span className="text-custom-yellow">COMMERZ</span></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;