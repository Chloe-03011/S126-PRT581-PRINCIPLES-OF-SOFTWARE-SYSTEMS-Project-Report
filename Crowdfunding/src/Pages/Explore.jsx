import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import CampaignCard from '../Components/Shared/CampaignCard';
import { Search, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

const Explore = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        type: searchParams.get('type') || '',
        search: searchParams.get('search') || ''
    });

    const categories = ['Technology', 'Environment', 'Education', 'Social Cause', 'Health', 'Creative'];

    useEffect(() => {
        // Sync filters with searchParams if they change externally (e.g. back button)
        setFilters({
            category: searchParams.get('category') || '',
            type: searchParams.get('type') || '',
            search: searchParams.get('search') || ''
        });
    }, [searchParams]);

    useEffect(() => {
        fetchCampaigns();
        
        // Update URL when filters change
        const newParams = {};
        if (filters.category) newParams.category = filters.category;
        if (filters.type) newParams.type = filters.type;
        if (filters.search) newParams.search = filters.search;
        setSearchParams(newParams);
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
        <div className="bg-white min-h-screen">
            {/* Header Section */}
            <section className="bg-background pt-24 pb-32 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-cream opacity-10 blur-[120px] rounded-full"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-4xl md:text-5xl font-bold text-text-primary mb-8 tracking-tighter uppercase"
                    >
                        FIND YOUR NEXT <span className="text-primary underline decoration-primary decoration-4 underline-offset-8">DISCOVERY</span>
                    </motion.h1>
                    
                    {/* Search Bar */}
                    <div className="max-w-3xl relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search projects, creators, ideas..."
                            className="w-full bg-white border border-border-light focus:ring-1 focus:ring-primary focus:border-primary outline-none py-4 pl-14 pr-6 rounded-lg text-lg font-bold text-text-primary transition-all placeholder:text-gray-300 shadow-sm"
                            value={filters.search}
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                        />
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
                {/* Filters Row */}
                <div className="bg-white rounded-lg shadow-sm p-4 border border-border-light flex flex-wrap items-center justify-between gap-6 mb-8">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[200px]">
                            <select 
                                className="w-full appearance-none bg-background border border-border-light hover:border-gray-300 py-2.5 pl-4 pr-10 rounded-lg font-bold text-[10px] uppercase tracking-widest outline-none transition-all cursor-pointer"
                                value={filters.category}
                                onChange={(e) => setFilters({...filters, category: e.target.value})}
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>

                        <div className="relative min-w-[200px]">
                            <select 
                                className="w-full appearance-none bg-background border border-border-light hover:border-gray-300 py-2.5 pl-4 pr-10 rounded-lg font-bold text-[10px] uppercase tracking-widest outline-none transition-all cursor-pointer"
                                value={filters.type}
                                onChange={(e) => setFilters({...filters, type: e.target.value})}
                            >
                                <option value="">All Types</option>
                                <option value="reward">Reward Projects</option>
                                <option value="charity">Cause Projects</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                        <SlidersHorizontal size={14} />
                        <span>Showing {campaigns.length} amazing projects</span>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-3 gap-8 py-10">
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <div key={n} className="h-[400px] bg-gray-50 rounded-lg border border-border-light animate-pulse"></div>
                        ))}
                    </div>
                ) : campaigns.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-8 pb-12">
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
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                            <Search size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-text-primary mb-2">No projects found</h3>
                        <p className="text-gray-500 font-normal">Try adjusting your filters or search terms.</p>
                        <button 
                            onClick={() => setFilters({ category: '', type: '', search: '' })}
                            className="mt-4 text-primary font-semibold hover:underline"
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
