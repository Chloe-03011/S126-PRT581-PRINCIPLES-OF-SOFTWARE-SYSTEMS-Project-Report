import React from 'react';
import { Link } from 'react-router-dom';

const CampaignCard = (props) => {
    // Support both direct props and a single 'campaign' object
    const data = props.campaign || props;
    const { _id, title, category, type, raised, goal, image, daysLeft } = data;

    // Additional mapping for nested campaign object if needed
    const displayType = type || (data.campaignType === 'reward' ? 'Reward' : 'Donation');
    const displayImage = image || data.thumbnail;
    const displayRaised = raised || data.totalRaised || 0;
    const displayGoal = goal || data.fundingGoal || 0;
    const displayDaysLeft = daysLeft !== undefined ? daysLeft : Math.max(0, Math.ceil((new Date(data.deadline) - new Date()) / (1000 * 60 * 60 * 24)));

    const progress = Math.min((displayRaised / displayGoal) * 100, 100) || 0;
    const isReward = displayType === 'Reward' || displayType === 'reward';
    
    return (
        <div className={`${isReward ? 'bg-grad-yellow' : 'bg-grad-blue'} rounded-2xl overflow-hidden border border-white/10 hover:shadow-2xl transition-all group flex flex-col h-full`}>
            {/* Image Section */}
            <Link to={`/campaign/${_id}`} className="relative h-48 overflow-hidden block">
                <img 
                    src={displayImage} 
                    alt={title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-custom-black text-custom-white border border-white/20">
                        {displayType} Based
                    </span>
                </div>
            </Link>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
                <span className="text-custom-white text-opacity-60 text-xs font-semibold uppercase tracking-widest mb-2">{category}</span>
                <Link to={`/campaign/${_id}`}>
                    <h3 className="text-xl font-bold text-custom-white mb-4 line-clamp-2 hover:opacity-80 cursor-pointer transition-opacity">
                        {title}
                    </h3>
                </Link>
                
                <div className="mt-auto">
                    {/* Progress Bar: Sky over White */}
                    <div className="w-full h-2 bg-custom-white rounded-full mb-4 overflow-hidden">
                        <div 
                            className="h-full bg-custom-blue rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <p className="text-2xl font-black text-custom-white">${Number(displayRaised).toLocaleString()}</p>
                            <p className="text-custom-white text-opacity-60 text-xs font-medium">raised of ${Number(displayGoal).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-custom-yellow">{displayDaysLeft}</p>
                            <p className="text-custom-white text-opacity-60 text-xs font-medium">days left</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Action Area */}
            <div className="px-6 pb-6 mt-2">
                <Link to={`/campaign/${_id}`} className="w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] bg-custom-white text-custom-black hover:bg-custom-yellow border border-transparent text-center block">
                    {isReward ? 'Back this Project' : 'Donate Now'}
                </Link>
            </div>
        </div>
    );
};

export default CampaignCard;