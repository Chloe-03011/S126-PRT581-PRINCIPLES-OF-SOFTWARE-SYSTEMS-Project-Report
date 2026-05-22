import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Users as UsersIcon } from 'lucide-react';

const MyProjectsTab = ({ 
    data, 
    navigate, 
    setSearchParams, 
    setStoryForm, 
    user 
}) => {
    return (
        <motion.div key="projects" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-6">
            {data.campaigns.length > 0 ? data.campaigns.map(campaign => (
                <div key={campaign._id} className="bg-white p-6 rounded-lg border border-border-light shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                            campaign.status === 'active' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-background border-border-light text-primary'
                        }`}>
                            {campaign.status}
                        </div>
                        <button 
                            onClick={() => navigate(`/edit-campaign/${campaign._id}`)}
                            className="text-gray-400 hover:text-text-primary transition-all"
                        >
                            <Settings size={18}/>
                        </button>
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-4 tracking-tight">{campaign.title}</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-gray-400">Raised</span>
                            <span className="text-primary">${campaign.totalRaised.toLocaleString()} / ${campaign.fundingGoal.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2 bg-background border border-border-light rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${(campaign.totalRaised/campaign.fundingGoal)*100}%` }} />
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-border-light flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <UsersIcon size={14} className="text-gray-400" />
                            <span className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">{campaign.backerCount} Backers</span>
                        </div>
                        <div className="flex gap-4">
                            {campaign.status === 'successful' && (
                                <button 
                                    onClick={() => {
                                        setSearchParams({ tab: 'success-stories' });
                                        setStoryForm({
                                            title: `Success: ${campaign.title}`,
                                            category: campaign.category,
                                            raised: `$${campaign.totalRaised}`,
                                            backers: campaign.backerCount,
                                            image: campaign.thumbnail,
                                            quote: '',
                                            author: user?.name,
                                            role: 'Project Creator'
                                        });
                                    }}
                                    className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all"
                                >
                                    Promote
                                </button>
                            )}
                            <button onClick={() => navigate(`/campaign/${campaign._id}`)} className="text-primary font-bold text-[10px] uppercase tracking-widest hover:underline">View Page</button>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="col-span-full py-20 text-center bg-white rounded-lg border border-dashed border-border-light">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No projects found</p>
                </div>
            )}
        </motion.div>
    );
};

export default MyProjectsTab;
