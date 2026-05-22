import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users as UsersIcon, Clock, CheckCircle, DollarSign, Layers, Heart, Rocket, Eye, XCircle, PlusCircle } from 'lucide-react';
import StatCard from '../StatCard';

const OverviewTab = ({ 
    isAdmin, 
    isCreator, 
    isBackerOnly, 
    user, 
    data, 
    navigate, 
    setIsCreatorModalOpen, 
    handleApprove 
}) => {
    return (
        <motion.div 
            key="overview" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }} 
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-12"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {isAdmin ? (
                    <>
                        <StatCard label="Global Impact" value={'$' + (data.stats?.platformTotal || 0).toLocaleString()} icon={TrendingUp} color="text-green-500" />
                        <StatCard label="Community Members" value={(data.stats?.totalUsers || 0).toLocaleString()} icon={UsersIcon} color="text-primary" />
                        <StatCard label="Projects in Review" value={data.stats?.pendingProjects || 0} icon={Clock} color="text-primary" />
                        <StatCard label="Creator Applications" value={data.stats?.pendingCreators || 0} icon={CheckCircle} color="text-primary" />
                    </>
                ) : isCreator ? (
                    <>
                        <StatCard label="Total Impact" value={`$${data.campaigns.reduce((acc, c) => acc + c.totalRaised, 0)}`} icon={DollarSign} color="text-green-500" />
                        <StatCard label="Active Visions" value={data.campaigns.length} icon={Layers} color="text-primary" />
                        <StatCard label="Supporters" value={data.campaigns.reduce((acc, c) => acc + c.backerCount, 0)} icon={UsersIcon} color="text-primary" />
                        <StatCard label="Contributions" value={data.donations.length || "0"} icon={Heart} color="text-purple-500" />

                        {/* Backer Profile Section for Creators */}
                        <div className="col-span-full mt-8">
                            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                <Heart size={14} className="text-primary" /> My Profile
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-lg border border-border-light shadow-sm">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Supported</p>
                                    <p className="text-2xl font-bold text-primary">${data.donations.reduce((acc, d) => acc + d.amount, 0).toLocaleString()}</p>
                                </div>
                                <div className="bg-white p-6 rounded-lg border border-border-light shadow-sm">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Projects Supported</p>
                                    <p className="text-2xl font-bold text-primary">{new Set(data.donations.map(d => d.campaignId?._id)).size}</p>
                                </div>
                                <div className="bg-background p-6 rounded-lg border border-border-light flex items-center justify-between group overflow-hidden relative">
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">My Impact</p>
                                        <p className="text-2xl font-bold text-primary">Supporter</p>
                                    </div>
                                    <Rocket className="absolute right-6 top-1/2 -translate-y-1/2 text-primary opacity-5 group-hover:opacity-10 transition-all" size={48} />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <StatCard label="Total Supported" value={`$${data.donations.reduce((acc, d) => acc + d.amount, 0).toLocaleString()}`} icon={Heart} color="text-primary" />
                        <StatCard label="Projects Supported" value={new Set(data.donations.map(d => d.campaignId?._id)).size} icon={Layers} color="text-primary" />
                        <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg border border-border-light shadow-sm flex items-center justify-between group overflow-hidden relative">
                            <div className="relative z-10">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">My Impact</p>
                                <p className="text-3xl font-bold text-text-primary uppercase tracking-tighter">Supporter</p>
                            </div>
                            <div className="absolute right-0 top-0 h-full w-1/4 bg-background group-hover:bg-cream transition-all"></div>
                        </div>
                    </>
                )}
            </div>

            {isBackerOnly && (
                <section className="bg-white p-10 rounded-lg border border-border-light shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-background opacity-50 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10 max-w-2xl">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-4">Our Shared Opportunity</p>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tighter uppercase leading-tight">
                            Bring your own <span className="text-primary">visions</span> to life.
                        </h2>
                        <p className="text-gray-500 font-bold text-sm mb-10 leading-relaxed uppercase tracking-wide">
                            Apply to become a verified creator and start raising funds for your projects. Our team will verify your identity to maintain platform trust.
                        </p>
                        {user?.approvalStatus === 'pending' ? (
                            <div className="bg-background border border-border-light p-4 rounded-lg flex items-center gap-3 w-fit">
                                <Clock className="text-primary" size={18} />
                                <p className="font-bold text-primary uppercase tracking-widest text-xs">We're reviewing your application</p>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsCreatorModalOpen(true)}
                                className="bg-primary text-white px-10 py-4 rounded-lg font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all"
                            >
                                Start Creating
                            </button>
                        )}
                    </div>
                </section>
            )}

            {isAdmin && data.pendingApprovals.length > 0 && (
                <section>
                    <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                        <Clock size={14} className="text-primary" /> Pending Reviews
                    </h2>
                    <div className="grid gap-4">
                        {data.pendingApprovals.map(campaign => (
                            <div key={campaign._id} className="bg-white p-6 rounded-lg border border-border-light shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <img src={campaign.thumbnail} className="w-16 h-16 rounded-lg object-cover border border-border-light" alt="" />
                                    <div>
                                        <h3 className="text-lg font-bold text-text-primary tracking-tight">{campaign.title}</h3>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">By {campaign.creatorId?.name} • ${campaign.fundingGoal} Goal</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => navigate(`/campaign/${campaign._id}`)} className="p-2.5 bg-background text-gray-400 hover:text-text-primary border border-border-light rounded-lg transition-all"><Eye size={18}/></button>
                                    <button onClick={() => handleApprove(campaign._id, false)} className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-100 rounded-lg transition-all"><XCircle size={18}/></button>
                                    <button onClick={() => handleApprove(campaign._id, true)} className="px-6 py-2.5 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:opacity-90 transition-all">Approve</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </motion.div>
    );
};

export default OverviewTab;
