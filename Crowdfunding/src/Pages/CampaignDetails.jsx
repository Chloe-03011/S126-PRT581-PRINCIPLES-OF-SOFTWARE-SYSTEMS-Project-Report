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

    if (loading) return <div className="min-h-screen bg-custom-white flex items-center justify-center font-black text-2xl">LOADING VISION...</div>;
    if (!campaign) return <div className="min-h-screen bg-custom-white flex items-center justify-center font-black text-2xl">PROJECT NOT FOUND</div>;

    const progress = Math.min((campaign.totalRaised / campaign.fundingGoal) * 100, 100);
    const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)));

    return (
        <div className="bg-custom-white min-h-screen pb-24">
            {/* Hero Header */}
            <header className="bg-custom-black text-custom-white pt-24 pb-40 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img src={campaign.thumbnail} alt="" className="w-full h-full object-cover blur-xl scale-110" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="bg-custom-yellow text-custom-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                            {campaign.category}
                        </span>
                        <span className="text-gray-400 font-bold">•</span>
                        <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">
                            {campaign.campaignType} Based
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight max-w-4xl">
                        {campaign.title}
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                        {campaign.tagline}
                    </p>
                </div>
            </header>

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left: Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl border border-gray-100 aspect-video group">
                            <img 
                                src={campaign.thumbnail} 
                                alt={campaign.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                            />
                        </div>

                        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl shadow-black/5 flex gap-4">
                            <button onClick={() => setActiveSection('about')} className={`px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${activeSection === 'about' ? 'bg-custom-black text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}>About</button>
                            <button onClick={() => setActiveSection('updates')} className={`px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${activeSection === 'updates' ? 'bg-custom-black text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}>Updates ({updates.length})</button>
                        </div>

                        {activeSection === 'about' ? (
                            <div className="bg-white rounded-[40px] p-12 border border-gray-100 shadow-xl shadow-black/5">
                                <h2 className="text-3xl font-black text-custom-black mb-8">About this Project</h2>
                                <div className="prose prose-xl max-w-none text-gray-500 leading-relaxed">
                                    {campaign.description}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {updates.length > 0 ? updates.map((upd, idx) => (
                                    <div key={upd._id} className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-black/5 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-2 h-full bg-custom-yellow"></div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <p className="text-[10px] font-black text-custom-blue uppercase tracking-widest mb-1">Update #{updates.length - idx}</p>
                                                <h3 className="text-3xl font-black text-custom-black tracking-tight">{upd.title}</h3>
                                            </div>
                                            <p className="text-xs font-bold text-gray-400">{new Date(upd.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="prose prose-lg max-w-none text-gray-600 mb-8 whitespace-pre-wrap">
                                            {upd.content}
                                        </div>
                                        {upd.images?.length > 0 && (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {upd.images.map((img, i) => (
                                                    <img key={i} src={img} className="rounded-2xl h-40 w-full object-cover border border-gray-100" alt="" />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )) : (
                                    <div className="bg-white rounded-[40px] p-20 text-center border border-dashed border-gray-200">
                                        <p className="text-gray-400 font-bold uppercase tracking-widest">No updates posted yet</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="bg-white rounded-[40px] p-12 border border-gray-100 shadow-xl shadow-black/5 flex flex-col md:flex-row items-center gap-10">
                            <img 
                                src={campaign.creatorId?.profilePicture || `https://ui-avatars.com/api/?name=${campaign.creatorId?.name}&background=random`} 
                                alt={campaign.creatorId?.name} 
                                className="w-32 h-32 rounded-3xl object-cover shadow-lg"
                            />
                            <div className="flex-grow text-center md:text-left">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">The Visionary Behind</h3>
                                <h4 className="text-3xl font-black text-custom-black mb-4">{campaign.creatorId?.name}</h4>
                                <p className="text-gray-500 font-bold mb-6 italic">
                                    {campaign.creatorId?.bio || "A dedicated innovator bringing fresh perspectives to the community."}
                                </p>
                                <Link 
                                    to={`/creator/${campaign.creatorId?._id}`}
                                    className="inline-flex items-center gap-2 text-custom-blue font-black uppercase text-sm hover:underline"
                                >
                                    View Full Profile <ExternalLink size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right: Funding & Tiers */}
                    <div className="space-y-8 relative">
                        <div className="bg-custom-black rounded-[40px] p-10 text-custom-white shadow-2xl relative">
                            <div className="space-y-8">
                                <div>
                                    <div className="flex justify-between items-end mb-4">
                                        <p className="text-5xl font-black text-custom-yellow">${campaign.totalRaised.toLocaleString()}</p>
                                        <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Raised</p>
                                    </div>
                                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-custom-blue"
                                        />
                                    </div>
                                    <p className="mt-3 text-sm font-bold text-gray-500">
                                        Goal: <span className="text-custom-white">${campaign.fundingGoal.toLocaleString()}</span> • {Math.round(progress)}% Funded
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                                        <Users className="text-custom-blue mb-2" size={20} />
                                        <p className="text-2xl font-black">{campaign.backerCount}</p>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase">Backers</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                                        <Calendar className="text-custom-yellow mb-2" size={20} />
                                        <p className="text-2xl font-black">{daysLeft}</p>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase">Days Left</p>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Donation Amount ($)</label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-custom-yellow font-black">$</span>
                                            <input 
                                                type="number" 
                                                value={customAmount}
                                                onChange={(e) => setCustomAmount(Number(e.target.value))}
                                                min="5"
                                                className="w-full bg-white/5 border-2 border-white/10 focus:border-custom-yellow outline-none py-4 pl-10 pr-6 rounded-2xl font-black text-xl transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all" onClick={() => setIsAnonymous(!isAnonymous)}>
                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isAnonymous ? 'bg-custom-yellow border-custom-yellow' : 'border-white/20'}`}>
                                            {isAnonymous && <CheckCircle2 size={14} className="text-custom-black" />}
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Back Anonymously</span>
                                    </div>

                                    {campaign.campaignType !== 'reward' && (
                                        <button 
                                            onClick={() => handleBackProject(null, customAmount * 115, 'BDT')}
                                            disabled={paymentLoading}
                                            className="w-full bg-custom-yellow text-custom-black py-5 rounded-2xl font-black text-lg hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mb-2"
                                        >
                                            <Target size={22} />
                                            Back Project (BDT)
                                        </button>
                                    )}
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <button 
                                            onClick={() => handleBackProject(null, customAmount, 'USD', 'stripe')}
                                            disabled={paymentLoading}
                                            className="w-full py-5 rounded-2xl font-black text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 bg-custom-black text-custom-white border-2 border-white/10 hover:border-custom-blue"
                                        >
                                            <FaStripe size={24} className="text-custom-blue" />
                                            Stripe
                                        </button>
                                        <button 
                                            onClick={() => handleBackProject(null, customAmount, 'USD', 'paypal')}
                                            disabled={paymentLoading}
                                            className="w-full py-5 rounded-2xl font-black text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 bg-[#0070ba] text-white hover:brightness-110"
                                        >
                                            <FaPaypal size={20} />
                                            PayPal
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 justify-center text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                    <ShieldCheck size={14} className="text-green-500" />
                                    Secure {campaign.fundingModel === 'all-or-nothing' ? 'All or Nothing' : 'Keep it All'} Payment
                                </div>
                            </div>
                        </div>

                        {rewardTiers.length > 0 && (
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-custom-black px-4">Select a Reward</h3>
                                {rewardTiers.map((tier) => (
                                    <div key={tier._id} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-black/5 hover:border-custom-yellow transition-all group cursor-pointer relative overflow-hidden">
                                        {tier.availability.isLimited && (
                                            <div className="absolute top-0 right-0 bg-custom-yellow text-custom-black px-4 py-1 text-[10px] font-black uppercase rounded-bl-xl">
                                                Limited ({tier.availability.totalSlots - tier.availability.claimedSlots} left)
                                            </div>
                                        )}
                                        <h4 className="text-xl font-black text-custom-black mb-2">{tier.title}</h4>
                                        <p className="text-2xl font-black text-custom-blue mb-4">Pledge ${tier.minimumAmount}+</p>
                                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                            {tier.description}
                                        </p>
                                        
                                        <div className="grid grid-cols-1 gap-3">
                                            <button 
                                                onClick={() => handleBackProject(tier._id, tier.minimumAmount, 'USD', 'stripe')}
                                                className="w-full py-4 rounded-xl border-2 border-custom-black text-custom-black font-black text-sm hover:bg-custom-black hover:text-custom-white transition-all flex items-center justify-center gap-2"
                                            >
                                                <FaStripe size={20} className="text-custom-blue" />
                                                Pledge with Stripe
                                            </button>
                                            <button 
                                                onClick={() => handleBackProject(tier._id, tier.minimumAmount, 'USD', 'paypal')}
                                                className="w-full py-4 rounded-xl bg-[#0070ba] text-white font-black text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2"
                                            >
                                                <FaPaypal size={16} />
                                                Pledge with PayPal
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
