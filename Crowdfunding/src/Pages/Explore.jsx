import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import CampaignCard from '../Components/Shared/CampaignCard';
import { Search, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const Explore = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        type: '',
        search: ''
    });

    const categories = ['Technology', 'Environment', 'Education', 'Social Cause', 'Health', 'Creative'];

    useEffect(() => {
        fetchCampaigns();
    }, [filters]);

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await api.get(`/campaigns?${queryParams}`);
            setCampaigns(response.data);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-custom-white min-h-screen">
            {/* Header Section */}
            <section className="bg-custom-black pt-20 pb-32 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-custom-yellow opacity-5 blur-[120px] rounded-full"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-black text-custom-white mb-8 tracking-tighter"
                    >
                        EXPLORE THE <span className="text-custom-yellow underline decoration-custom-blue decoration-4 underline-offset-8">FUTURE</span>
                    </motion.h1>
                    
                    {/* Search Bar */}
                    <div className="max-w-3xl relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-custom-yellow transition-colors" size={24} />
                        <input 
                            type="text" 
                            placeholder="Search projects, creators, or keywords..."
                            className="w-full bg-white/5 border-2 border-white/10 focus:border-custom-yellow focus:bg-white/10 outline-none py-6 pl-16 pr-6 rounded-3xl text-xl font-bold text-custom-white transition-all placeholder:text-gray-600"
                            value={filters.search}
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                        />
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                {/* Filters Row */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-black/5 p-6 border border-gray-100 flex flex-wrap items-center justify-between gap-6 mb-12">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative min-w-[200px]">
                            <select 
                                className="w-full appearance-none bg-gray-50 border-2 border-transparent hover:border-gray-100 py-3 pl-4 pr-10 rounded-xl font-bold text-sm outline-none transition-all cursor-pointer"
                                value={filters.category}
                                onChange={(e) => setFilters({...filters, category: e.target.value})}
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                        </div>

                        <div className="relative min-w-[200px]">
                            <select 
                                className="w-full appearance-none bg-gray-50 border-2 border-transparent hover:border-gray-100 py-3 pl-4 pr-10 rounded-xl font-bold text-sm outline-none transition-all cursor-pointer"
                                value={filters.type}
                                onChange={(e) => setFilters({...filters, type: e.target.value})}
                            >
                                <option value="">All Project Types</option>
                                <option value="reward">Reward Based</option>
                                <option value="charity">Charity Based</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                        <SlidersHorizontal size={18} />
                        <span>Showing {campaigns.length} projects</span>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-3 gap-8 py-20">
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <div key={n} className="h-[450px] bg-gray-100 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : campaigns.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-8 pb-24">
                        {campaigns.map((campaign) => (
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
                ) : (
                    <div className="text-center py-40">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <Search size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-custom-black mb-2">No projects found</h3>
                        <p className="text-gray-500 font-medium">Try adjusting your filters or search terms.</p>
                        <button 
                            onClick={() => setFilters({ category: '', type: '', search: '' })}
                            className="mt-8 text-custom-blue font-bold hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Explore;
