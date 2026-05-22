import React, { useEffect, useState } from 'react';
import CampaignCard from '../Shared/CampaignCard';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Gift, Heart, ArrowRight } from 'lucide-react';
import { FaPaypal, FaStripe } from 'react-icons/fa';

const Home = () => {
    const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
        <div className="overflow-hidden bg-white">
            {/* Hero Section */}
            <section className="relative bg-background text-text-primary py-16 lg:py-24">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-cream opacity-20 blur-[120px] rounded-full"></div>
                    <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary opacity-10 blur-[120px] rounded-full"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter leading-tight"
                    >
                        EVERY <span className="text-primary underline decoration-primary underline-offset-8 decoration-4">DREAM</span> STARTS HERE
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
                        className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-bold uppercase tracking-wide"
                    >
                        The thoughtful way to fund creative projects and support causes that matter. Build your community, bring ideas to life.
                    </motion.p>
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <button 
                            onClick={() => navigate('/explore?type=reward')}
                            className="w-full sm:w-auto bg-primary text-white px-10 py-4 rounded-lg font-bold text-sm uppercase tracking-widest transition-all hover:opacity-90"
                        >
                            Back a Reward Project
                        </button>
                        <button 
                            onClick={() => navigate('/explore?type=charity')}
                            className="w-full sm:w-auto bg-white border border-border-light text-text-primary px-10 py-4 rounded-lg font-bold text-sm uppercase tracking-widest transition-all hover:bg-background"
                        >
                            Make an Impact
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Crowdfunding Models Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">Pick Your Path</h2>
                        <h3 className="text-4xl font-bold text-text-primary tracking-tight">Support innovation or make an impact.</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Reward Based Card */}
                        <div className="p-10 rounded-[40px] bg-cream border border-border-light shadow-xl shadow-text-primary/5 transition-all group hover:scale-[1.02]">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 border border-border-light shadow-sm transition-transform group-hover:rotate-6">
                                <Gift className="text-primary" size={32} />
                            </div>
                            <h3 className="text-3xl font-bold text-text-primary mb-4 tracking-tighter uppercase">Reward Projects</h3>
                            <p className="text-gray-500 mb-10 leading-relaxed text-sm font-semibold uppercase tracking-wide">
                                Support creators bringing ideas to life. Back innovative projects and get exclusive rewards, early access, and the satisfaction of making it happen.
                            </p>
                            
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Pay with</span>
                                    <div className="flex gap-2">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border-light rounded-full shadow-sm">
                                            <FaStripe className="text-primary" size={14} />
                                            <span className="text-[10px] font-bold text-text-primary uppercase">Stripe</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border-light rounded-full shadow-sm">
                                            <FaPaypal className="text-blue-600" size={12} />
                                            <span className="text-[10px] font-bold text-text-primary uppercase italic">PayPal</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => navigate('/explore?type=reward')}
                                    className="w-fit text-primary font-bold uppercase text-xs tracking-widest flex items-center gap-2 group/btn transition-all"
                                >
                                    Learn about Rewards <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                                </button>
                            </div>
                        </div>

                        {/* Donation Based Card */}
                        <div className="p-10 rounded-[40px] bg-white border border-border-light shadow-xl shadow-text-primary/5 transition-all group hover:scale-[1.02]">
                            <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mb-8 border border-border-light shadow-sm transition-transform group-hover:rotate-6">
                                <Heart className="text-primary" size={32} />
                            </div>
                            <h3 className="text-3xl font-bold text-text-primary mb-4 tracking-tighter uppercase">Cause Projects</h3>
                            <p className="text-gray-500 mb-10 leading-relaxed text-sm font-semibold uppercase tracking-wide">
                                Support causes close to your heart. Your contribution makes a direct impact, whether it’s a personal emergency or a community dream. Every dollar counts.
                            </p>

                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Pay with</span>
                                    <div className="flex flex-wrap gap-2">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border-light rounded-full shadow-sm">
                                            <FaStripe className="text-primary" size={14} />
                                            <span className="text-[10px] font-bold text-text-primary uppercase">Stripe</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border-light rounded-full shadow-sm">
                                            <FaPaypal className="text-blue-600" size={12} />
                                            <span className="text-[10px] font-bold text-text-primary uppercase italic">PayPal</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border-light rounded-full shadow-sm">
                                            <span className="text-[10px] font-black text-text-primary tracking-tighter">SSL<span className="text-primary">C</span></span>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => navigate('/explore?type=charity')}
                                    className="w-fit text-primary font-bold uppercase text-xs tracking-widest flex items-center gap-2 group/btn transition-all"
                                >
                                    Start Donating <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Campaigns Section */}
            <section className="py-20 bg-background">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">What's Trending</h2>
                            <h3 className="text-4xl font-bold text-text-primary tracking-tight">Explore projects changing lives.</h3>
                        </div>
                        <button 
                            onClick={() => navigate('/explore')}
                            className="bg-white text-text-primary px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest border border-border-light hover:bg-background transition-all"
                        >
                            Explore All Projects
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
            <section className="py-16 bg-white border-y border-border-light">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    <div className="text-text-primary font-bold text-sm uppercase tracking-[0.4em]">Our Partners</div>
                    <div className="flex flex-wrap justify-center items-center gap-16">
                        <div className="text-text-primary font-bold text-2xl uppercase tracking-widest">stripe</div>
                        <div className="text-text-primary font-bold italic text-2xl">PayPal</div>
                        <div className="text-text-primary font-extrabold text-2xl tracking-tighter">SSL<span className="text-primary">COMMERZ</span></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
