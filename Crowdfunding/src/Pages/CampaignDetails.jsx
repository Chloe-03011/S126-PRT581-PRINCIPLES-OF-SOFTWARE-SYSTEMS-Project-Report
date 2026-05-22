import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../Contexts/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, Users, Target, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';
import { FaPaypal, FaStripe } from 'react-icons/fa';

export default function CampaignDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [campaign, setCampaign] = useState(null);
    const [rewardTiers, setRewardTiers] = useState([]);
    const [updates, setUpdates] = useState([]);
    const [activeSection, setActiveSection] = useState('about');
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [customAmount, setCustomAmount] = useState(50);
    const [isAnonymous, setIsAnonymous] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [campaignRes, updatesRes] = await Promise.all([
                    api.get(`/campaigns/${id}`),
                    api.get(`/updates/${id}`)
                ]);
                setCampaign(campaignRes.data.campaign);
                setRewardTiers(campaignRes.data.rewardTiers);
                setUpdates(updatesRes.data);
            } catch (error) {
                console.error('Error fetching campaign details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleBackProject = async (tierId, amount, currency, gateway = null) => {
        if (!user) {
            navigate('/login', { state: { from: window.location.pathname } });
            return;
        }

        const finalAmount = tierId ? amount : customAmount;
        
        if (!tierId && currency === 'USD' && finalAmount < 5) {
            alert('Minimum donation amount is $5');
            return;
        }

        setPaymentLoading(true);
        try {
            const payload = {
                campaignId: id,
                rewardTierId: tierId,
                amount: finalAmount,
                isAnonymous: isAnonymous,
                shippingAddress: {
                    fullName: user.name,
                    phone: user.phone || '01700000000',
                    addressLine: user.address || 'N/A',
                    city: 'Dhaka',
                    country: 'Bangladesh'
                }
            };

            if (currency === 'BDT') {
                const response = await api.post('/payment/ssl-request', payload);
                window.location.replace(response.data.url);
            } else {
                const endpoint = gateway === 'paypal' ? '/payment/paypal-request' : '/payment/stripe-request';
                const response = await api.post(endpoint, payload);
                if (response.data.url) {
                    window.location.replace(response.data.url);
                }
            }
        } catch (error) {
            console.error('Payment Error:', error);
            alert('Payment initialization failed.');
        } finally {
            setPaymentLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-bold text-2xl">LOADING VISION...</div>;
    if (!campaign) return <div className="min-h-screen bg-white flex items-center justify-center font-bold text-2xl">PROJECT NOT FOUND</div>;

    const progress = Math.min((campaign.totalRaised / campaign.fundingGoal) * 100, 100);
    const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)));

    return (
        <div className="bg-white min-h-screen pb-12">
            {/* Hero Header */}
            <header className="bg-background text-text-primary py-24 relative overflow-hidden border-b border-border-light">
                <div className="absolute inset-0">
                    <img src={campaign.thumbnail} alt="" className="w-full h-full object-cover blur-3xl opacity-10 scale-110" />
                    <div className="absolute inset-0 bg-primary opacity-5"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-3 py-1 bg-white border border-border-light rounded-full text-[10px] font-bold text-primary uppercase tracking-[0.2em] shadow-sm">
                                {campaign.category}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                • {campaign.campaignType === 'reward' ? 'Reward' : 'Donation'} Based Project
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tighter leading-tight uppercase">
                            {campaign.title}
                        </h1>
                        <p className="text-lg text-gray-500 font-bold uppercase tracking-wide leading-relaxed max-w-2xl">
                            {campaign.tagline || "Support this visionary project and help bring it to life."}
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Funding & Tiers (Sidebar) */}
                    <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8 self-start">
                    <div className="bg-white rounded-lg p-6 text-text-primary shadow-sm border border-border-light relative">
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-end mb-3">
                                    <p className="text-4xl font-bold text-primary tracking-tight">${campaign.totalRaised.toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Raised So Far</p>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-primary"
                                    />
                                </div>
                                <p className="mt-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                                    Goal: <span className="text-text-primary">${campaign.fundingGoal.toLocaleString()}</span> • {Math.round(progress)}% Funded
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-background p-4 rounded-lg border border-border-light">
                                    <Users className="text-primary mb-2" size={18} />
                                    <p className="text-xl font-bold">{campaign.backerCount || 0}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Supporters</p>
                                </div>
                                <div className="bg-background p-4 rounded-lg border border-border-light">
                                    <Calendar className="text-primary mb-2" size={18} />
                                    <p className="text-xl font-bold">{daysLeft}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Time Left</p>
                                </div>
                            </div>

                            <div className="pt-2 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Your Support ($)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                        <input 
                                            type="number" 
                                            value={customAmount}
                                            onChange={(e) => setCustomAmount(Number(e.target.value))}
                                            min="5"
                                            className="w-full bg-background border border-border-light focus:ring-1 focus:ring-primary focus:border-primary outline-none py-3.5 pl-8 pr-4 rounded-lg font-bold text-lg transition-all"
                                            placeholder="Amount to support"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 px-4 py-3 bg-background rounded-lg border border-border-light cursor-pointer hover:bg-gray-50 transition-all" onClick={() => setIsAnonymous(!isAnonymous)}>
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isAnonymous ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                                        {isAnonymous && <CheckCircle2 size={12} className="text-white" />}
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Make My Support Private</span>
                                </div>

                                {campaign.campaignType !== 'reward' && (
                                    <button 
                                        onClick={() => handleBackProject(null, customAmount * 115, 'BDT')}
                                        disabled={paymentLoading}
                                        className="w-full bg-cream text-text-primary py-4 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-opacity-80 transition-all flex items-center justify-center gap-2 mb-2"
                                    >
                                        <Target size={18} />
                                        Back Project (BDT)
                                    </button>
                                )}

                                <div className="grid grid-cols-1 gap-3">
                                    <button 
                                        onClick={() => handleBackProject(null, customAmount, 'USD', 'stripe')}
                                        disabled={paymentLoading}
                                        className="w-full py-4 rounded-lg font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-primary text-white hover:opacity-90"
                                    >
                                        <FaStripe size={20} />
                                        Support with Card
                                    </button>
                                    <button 
                                        onClick={() => handleBackProject(null, customAmount, 'USD', 'paypal')}
                                        disabled={paymentLoading}
                                        className="w-full py-4 rounded-lg font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-light-blue text-text-primary hover:opacity-90"
                                    >
                                        <FaPaypal size={18} />
                                        Support with PayPal
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 justify-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-2">
                                <ShieldCheck size={14} className="text-primary" />
                                Protected by bank-level security
                            </div>
                        </div>
                    </div>

                    {rewardTiers.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-text-primary px-2 uppercase tracking-widest">Choose Your Reward</h3>
                            {rewardTiers.map((tier) => (
                                <div key={tier._id} className="bg-white rounded-lg p-5 border border-border-light shadow-sm hover:border-primary transition-all group cursor-pointer relative overflow-hidden">
                                    {tier.availability.isLimited && (
                                        <div className="absolute top-0 right-0 bg-cream text-text-primary px-3 py-1 text-[10px] font-bold uppercase rounded-bl-lg border-l border-b border-border-light">
                                            Limited ({tier.availability.totalSlots - tier.availability.claimedSlots} left)
                                        </div>
                                    )}
                                    <h4 className="text-lg font-bold text-text-primary mb-1">{tier.title}</h4>
                                    <p className="text-xl font-bold text-primary mb-3">Pledge ${tier.minimumAmount}+</p>
                                    <p className="text-xs text-gray-500 mb-5 leading-relaxed line-clamp-3">
                                        {tier.description}
                                    </p>

                                    <div className="grid grid-cols-1 gap-2">
                                        <button 
                                            onClick={() => handleBackProject(tier._id, tier.minimumAmount, 'USD', 'stripe')}
                                            className="w-full py-3 rounded-lg border border-border-light text-text-primary font-bold text-[10px] uppercase tracking-widest hover:bg-background transition-all flex items-center justify-center gap-2"
                                        >
                                            <FaStripe size={18} className="text-primary" />
                                            Support with Card
                                        </button>
                                        <button 
                                            onClick={() => handleBackProject(tier._id, tier.minimumAmount, 'USD', 'paypal')}
                                            className="w-full py-3 rounded-lg bg-light-blue text-text-primary font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                        >
                                            <FaPaypal size={14} />
                                            Support with PayPal
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    </div>

                    {/* Right: Content */}
                    <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-border-light aspect-video">
                        <img 
                            src={campaign.thumbnail} 
                            alt={campaign.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="bg-white rounded-lg p-2 border border-border-light shadow-sm flex gap-2">
                        <button onClick={() => setActiveSection('about')} className={`flex-1 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${activeSection === 'about' ? 'bg-background text-text-primary border border-border-light shadow-sm' : 'text-gray-400 hover:bg-gray-50'}`}>The Story</button>
                        <button onClick={() => setActiveSection('updates')} className={`flex-1 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${activeSection === 'updates' ? 'bg-background text-text-primary border border-border-light shadow-sm' : 'text-gray-400 hover:bg-gray-50'}`}>Updates ({updates.length})</button>
                    </div>

                    {activeSection === 'about' ? (
                        <div className="bg-white rounded-lg p-8 border border-border-light shadow-sm">
                            <h2 className="text-xl font-bold text-text-primary mb-6 uppercase tracking-widest">The Story</h2>
                            <div className="prose prose-lg max-w-none text-gray-500 leading-relaxed text-sm">
                                {campaign.description}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {updates.length > 0 ? updates.map((upd, idx) => (
                                <div key={upd._id} className="bg-white rounded-lg p-6 border border-border-light shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary opacity-20"></div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Update from the creator</p>
                                            <h3 className="text-2xl font-bold text-text-primary tracking-tight">{upd.title}</h3>
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{new Date(upd.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="prose prose-md max-w-none text-gray-600 mb-6 whitespace-pre-wrap text-sm">
                                        {upd.content}
                                    </div>
                                    {upd.images?.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {upd.images.map((img, i) => (
                                                <img key={i} src={img} className="rounded-lg h-40 w-full object-cover border border-border-light" alt="" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <div className="bg-white rounded-lg p-20 text-center border border-dashed border-border-light">
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No updates posted yet</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="bg-white rounded-lg p-8 border border-border-light shadow-sm flex flex-col md:flex-row items-center gap-8">
                        <img 
                            src={campaign.creatorId?.profilePicture || `https://ui-avatars.com/api/?name=${campaign.creatorId?.name}&background=random`} 
                            alt={campaign.creatorId?.name} 
                            className="w-24 h-24 rounded-lg object-cover border border-border-light"
                        />
                        <div className="flex-grow text-center md:text-left">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Meet the Creator</h3>
                            <h4 className="text-2xl font-bold text-text-primary mb-1">{campaign.creatorId?.name}</h4>
                            <p className="text-gray-500 font-bold mb-4 italic text-sm">
                                {campaign.creatorId?.bio || "A dedicated innovator bringing fresh perspectives to the community."}
                            </p>
                            <Link 
                                to={`/creator/${campaign.creatorId?._id}`}
                                className="inline-flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest hover:underline"
                            >
                                Learn More <ExternalLink size={14} />
                            </Link>
                        </div>
                    </div>
                    </div>                </div>
            </div>
        </div>
    );
}
