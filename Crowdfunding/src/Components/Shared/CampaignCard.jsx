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
        <div className="bg-white rounded-lg overflow-hidden border border-border-light shadow-sm transition-all group flex flex-col h-full">
            {/* Image Section */}
            <Link to={`/campaign/${_id}`} className="relative h-48 overflow-hidden block">
                <img 
                    src={displayImage} 
                    alt={title} 
                    className="w-full h-full object-cover transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-cream text-text-primary border border-border-light">
                        {displayType} Project
                    </span>
                </div>
            </Link>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-grow">
                <span className="text-text-primary text-opacity-60 text-[10px] font-bold uppercase tracking-widest mb-1">{category}</span>
                <Link to={`/campaign/${_id}`}>
                    <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2 hover:text-primary cursor-pointer transition-colors">
                        {title}
                    </h3>
                </Link>
                
                <div className="mt-auto">
                    {/* Progress Bar: Light Gray over Sea Green */}
                    <div className="w-full h-2 bg-gray-100 rounded-full mb-3 overflow-hidden">
                        <div 
                            className="h-full bg-primary rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-end">
                        <div className="space-y-0.5">
                            <p className="text-xl font-bold text-text-primary">${Number(displayRaised).toLocaleString()}</p>
                            <p className="text-text-secondary text-[10px] font-bold uppercase tracking-tight">pledged of ${Number(displayGoal).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-base font-bold text-primary">{displayDaysLeft}</p>
                            <p className="text-text-secondary text-[10px] font-bold uppercase tracking-tight">days left</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Action Area */}
            <div className="px-4 pb-4 mt-2">
                <Link to={`/campaign/${_id}`} className="w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all bg-background text-text-primary hover:bg-cream border border-border-light text-center block">
                    {isReward ? 'Back Project' : 'Support Cause'}
                </Link>
            </div>
        </div>
    );
};

export default CampaignCard;
