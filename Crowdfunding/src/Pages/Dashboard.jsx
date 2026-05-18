import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import api from '../api/axios';
import { 
    LayoutDashboard, 
    Layers, 
    Users as UsersIcon, 
    Wallet, 
    Settings, 
    CheckCircle, 
    XCircle, 
    Eye,
    TrendingUp,
    Heart,
    PlusCircle,
    Clock,
    DollarSign,
    ShieldAlert,
    ExternalLink,
    ArrowUpRight,
    Rocket,
    Trash2,
    Pencil,
    Newspaper,
    Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../Contexts/NotificationContext';

const DynamicDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';

    const [data, setData] = useState({
        campaigns: [],
        donations: [],
        contributions: [],
        withdrawals: [],
        pendingApprovals: [],
        pendingUsers: [],
        users: [],
        stories: [],
        allDonations: [],
        allWithdrawals: [],
        updates: [], // For creator updates management
        fulfillmentStats: [], // For admin monitoring
        campaignBackers: null // For creator backer management
    });
    const [loading, setLoading] = useState(true); // Initial page load
    const [tabLoading, setTabLoading] = useState(false); // Switching tabs
    const [loadedTabs, setLoadedTabs] = useState(new Set()); // Simple cache
    const [selectedCampaignForBackers, setSelectedCampaignForBackers] = useState(null);
    const [selectedCampaignForWithdrawal, setSelectedCampaignForWithdrawal] = useState(null);
    const [withdrawalStats, setWithdrawalStats] = useState(null);
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [requestingPayout, setRequestingPayout] = useState(false);
    const [payoutForm, setPayoutForm] = useState({
        amount: '',
        method: 'Bank Transfer',
        accountNumber: ''
    });
    const [backerStatusFilter, setBackerStatusFilter] = useState('remaining'); // 'sent' or 'remaining'
    const [updatingBackerStatus, setUpdatingBackerStatus] = useState(null);
    const [confirmingDelivery, setConfirmingDelivery] = useState(null);
    const [updatingCampaignProgress, setUpdatingCampaignProgress] = useState(false);
    const [uploadingStory, setUploadingStory] = useState(false);
    const [editStoryId, setEditStoryId] = useState(null);
    const [processingUser, setProcessingUser] = useState(null);
    const [financeSubTab, setFinanceSubTab] = useState('donations');
    const [profileForm, setProfileForm] = useState({
        bio: '',
        website: '',
        socialLinks: {
            facebook: '',
            twitter: '',
            linkedin: ''
        }
    });
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [processingReg, setProcessingReg] = useState(null);
    const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);
    const [creatorForm, setCreatorForm] = useState({ nid: '', address: '', phone: '' });
    const [applyingCreator, setApplyingCreator] = useState(false);
    const [storyForm, setStoryForm] = useState({
        title: '',
        category: '',
        raised: '',
        backers: '',
        image: '',
        quote: '',
        author: '',
        role: ''
    });

    const [statusModal, setStatusModal] = useState({
        show: false,
        type: null,
        id: null,
        reason: '',
        paymentProof: '',
        adminComment: '',
        isProcessing: false
    });

    const [expandedWithdrawal, setExpandedWithdrawal] = useState(null);
    const [postingUpdate, setPostingUpdate] = useState(false);
    const [updateForm, setUpdateForm] = useState({
        campaignId: '',
        title: '',
        content: '',
        images: ''
    });
    const isCreator = user?.role.includes('creator');
    const isAdmin = user?.role.includes('admin');
    const isBackerOnly = user?.role.includes('backer') && !isCreator && !isAdmin;

    const handleApplyCreator = async (e) => {
        e.preventDefault();
        setApplyingCreator(true);
        try {
            await api.patch('/auth/apply-creator', creatorForm);
            alert('Application submitted! Your account is now under verification.');
            setIsCreatorModalOpen(false);
            window.location.reload(); // Refresh to show pending state
        } catch (error) {
            alert(error.response?.data?.message || 'Application failed');
        } finally {
            setApplyingCreator(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [activeTab, user, financeSubTab]);

    const fetchDashboardData = async (forceRefresh = false) => {
        // Only set global loading for the very first visit
        const isFirstLoad = loadedTabs.size === 0;
        if (isFirstLoad) setLoading(true);
        else setTabLoading(true);

        try {
            // Check if tab is already loaded to avoid redundant calls, unless forced
            const cacheKey = activeTab === 'finance' ? `finance-${financeSubTab}` : activeTab;
            if (!forceRefresh && loadedTabs.has(cacheKey) && activeTab !== 'overview') return;

            const updateData = (newData) => {
                setData(prev => ({ ...prev, ...newData }));
                setLoadedTabs(prev => {
                    const next = new Set(prev);
                    next.add(cacheKey);
                    return next;
                });
            };

            // Fetch only what's needed for the active tab
            switch (activeTab) {
                case 'overview':
                    if (isAdmin) {
                        const [campRes, userRes] = await Promise.all([
                            api.get('/campaigns?status=pending'),
                            api.get('/auth/users/pending')
                        ]);
                        updateData({ pendingApprovals: campRes.data, pendingUsers: userRes.data });
                    }
                    if (isCreator) {
                        const res = await api.get('/campaigns/my-campaigns');
                        updateData({ campaigns: res.data });
                    }
                    const donRes = await api.get('/payment/my-donations');
                    updateData({ donations: donRes.data });
                    break;

                case 'approvals':
                    const [pCamp, pUser] = await Promise.all([
                        api.get('/campaigns?status=pending,active,successful,failed,banned'),
                        api.get('/auth/users/pending')
                    ]);
                    updateData({ pendingApprovals: pCamp.data, pendingUsers: pUser.data });
                    break;

                case 'user-approvals':
                    const puRes = await api.get('/auth/users/pending');
                    updateData({ pendingUsers: puRes.data });
                    break;

                case 'users':
                    const uRes = await api.get('/auth/users');
                    updateData({ users: uRes.data });
                    break;

                case 'success-stories':
                    const sRes = await api.get('/success-stories');
                    updateData({ stories: sRes.data });
                    break;

                case 'finance':
                    if (financeSubTab === 'donations') {
                        const res = await api.get('/payment/all-donations');
                        updateData({ allDonations: res.data });
                    } else {
                        const res = await api.get('/payment/all-withdrawals');
                        updateData({ allWithdrawals: res.data });
                    }
                    break;

                case 'fulfillment-monitor':
                    const fRes = await api.get('/campaigns/admin/fulfillment-monitor');
                    updateData({ fulfillmentStats: fRes.data });
                    break;

                case 'my-projects':
                case 'backer-management':
                    const mRes = await api.get('/campaigns/my-campaigns');
                    updateData({ campaigns: mRes.data });
                    break;

                case 'contributions':
                    const cRes = await api.get('/payment/project-contributions');
                    updateData({ contributions: cRes.data });
                    break;

                case 'backed-projects':
                case 'donations':
                    const dRes = await api.get('/payment/my-donations');
                    updateData({ donations: dRes.data });
                    break;

                case 'withdrawals':
                    const wRes = await api.get('/payment/my-withdrawals');
                    const myCamps = await api.get('/campaigns/my-campaigns'); // Needed for the financial studio selector
                    updateData({ withdrawals: wRes.data, campaigns: myCamps.data });
                    break;

                case 'updates':
                    const myCampsUpdate = await api.get('/campaigns/my-campaigns');
                    updateData({ campaigns: myCampsUpdate.data });
                    break;
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
            setTabLoading(false);
        }
    };

    const fetchUpdatesForCampaign = async (campaignId) => {
        setUpdateForm(prev => ({ ...prev, campaignId }));
        try {
            const res = await api.get(`/updates/${campaignId}`);
            setData(prev => ({ ...prev, updates: res.data }));
        } catch (error) {
            alert('Failed to fetch updates');
        }
    };

    const handlePostUpdate = async (e) => {
        e.preventDefault();
        if (!updateForm.campaignId) return alert('Please select a campaign');
        setPostingUpdate(true);
        try {
            const imagesArray = updateForm.images.split(',').map(s => s.trim()).filter(s => s);
            await api.post(`/updates/${updateForm.campaignId}`, {
                ...updateForm,
                images: imagesArray
            });
            alert('Update posted successfully!');
            setUpdateForm({ title: '', content: '', images: '', isBackerOnly: false, campaignId: updateForm.campaignId });
            fetchUpdatesForCampaign(updateForm.campaignId);
        } catch (error) {
            alert('Failed to post update');
        } finally {
            setPostingUpdate(false);
        }
    };

    const handleDeleteUpdate = async (id) => {
        if (!window.confirm('Delete this update?')) return;
        try {
            await api.delete(`/updates/${id}`);
            fetchUpdatesForCampaign(updateForm.campaignId);
        } catch (error) {
            alert('Delete failed');
        }
    };

    const handleApproveRegistration = async (id, isApproved) => {
        setProcessingReg(id);
        try {
            await api.patch(`/auth/users/${id}/approve-registration`, { isApproved });
            fetchDashboardData(true);
        } catch (error) {
            alert('Action failed');
        } finally {
            setProcessingReg(null);
        }
    };

    const handleToggleCampaignBan = async (id) => {
        if (!window.confirm('Are you sure you want to change this campaign\'s ban status?')) return;
        try {
            await api.patch(`/campaigns/${id}/toggle-ban`);
            fetchDashboardData(true);
        } catch (error) {
            alert('Failed to update campaign status');
        }
    };

    const handleApprove = async (id, isApproved) => {
        try {
            await api.patch(`/campaigns/${id}/approve`, { isApproved });
            fetchDashboardData(true);
        } catch (error) {
            alert('Action failed');
        }
    };

    const handleToggleBan = async (id) => {
        setProcessingUser(id);
        try {
            await api.patch(`/auth/users/${id}/toggle-ban`);
            fetchDashboardData(true);
        } catch (error) {
            alert('Failed to update user status');
        } finally {
            setProcessingUser(null);
        }
    };

    const handleFetchBackers = async (campaignId) => {
        setSelectedCampaignForBackers(campaignId);
        try {
            const res = await api.get(`/campaigns/${campaignId}/backers`);
            setData(prev => ({ ...prev, campaignBackers: res.data }));
        } catch (error) {
            alert('Failed to fetch backers');
        }
    };

    const handleUpdateBackerStatus = async (donationId, tierId, isFulfilled) => {
        setUpdatingBackerStatus(`${donationId}-${tierId}`);
        try {
            await api.patch(`/campaigns/donations/${donationId}/reward-status`, { 
                tierId, 
                status: isFulfilled ? 'fulfilled' : 'pending' 
            });
            // Refresh backers
            handleFetchBackers(selectedCampaignForBackers);
        } catch (error) {
            alert('Failed to update status');
        } finally {
            setUpdatingBackerStatus(null);
        }
    };

    const handleUpdateCampaignProgress = async (e) => {
        e.preventDefault();
        setUpdatingCampaignProgress(true);
        const formData = new FormData(e.target);
        try {
            await api.patch(`/campaigns/${selectedCampaignForBackers}/reward-progress`, {
                rewardProgressStatus: formData.get('status'),
                rewardProgressNote: formData.get('note')
            });
            alert('Campaign progress updated!');
            handleFetchBackers(selectedCampaignForBackers);
        } catch (error) {
            alert('Update failed');
        } finally {
            setUpdatingCampaignProgress(false);
        }
    };

    const handleConfirmDelivery = async (donationId, tierId) => {
        setConfirmingDelivery(donationId);
        try {
            await api.patch(`/campaigns/donations/${donationId}/confirm-delivery`, { tierId });
            alert('Thank you for confirming!');
            fetchDashboardData(true);
        } catch (error) {
            alert('Confirmation failed');
        } finally {
            setConfirmingDelivery(null);
        }
    };

    const fetchWithdrawalStats = async (campaignId) => {
        setSelectedCampaignForWithdrawal(campaignId);
        try {
            const res = await api.get(`/campaigns/${campaignId}/withdrawal-stats`);
            setWithdrawalStats(res.data);
            setPayoutForm(prev => ({ ...prev, amount: res.data.currentAvailable }));
        } catch (error) {
            alert('Failed to fetch withdrawal stats');
        }
    };

    const handleRequestPayout = async (e) => {
        e.preventDefault();
        setRequestingPayout(true);
        try {
            await api.post('/payment/request-withdrawal', {
                campaignId: selectedCampaignForWithdrawal,
                ...payoutForm
            });
            alert('Withdrawal request submitted!');
            setShowPayoutModal(false);
            fetchWithdrawalStats(selectedCampaignForWithdrawal);
            fetchDashboardData(true);
        } catch (error) {
            alert(error.response?.data?.message || 'Request failed');
        } finally {
            setRequestingPayout(false);
        }
    };

    const handleOpenStatusModal = (id, type) => {
        setStatusModal({
            show: true,
            type,
            id,
            reason: '',
            paymentProof: '',
            adminComment: '',
            isProcessing: false
        });
    };

    const handleConfirmStatusUpdate = async () => {
        if (statusModal.type === 'rejected' && !statusModal.reason) {
            alert('Reason is required for rejection');
            return;
        }
        if (statusModal.type === 'completed' && !statusModal.paymentProof) {
            alert('Payment proof (TxID/URL) is required to mark as completed');
            return;
        }

        setStatusModal(prev => ({ ...prev, isProcessing: true }));
        try {
            await api.patch(`/payment/withdrawals/${statusModal.id}/status`, { 
                status: statusModal.type, 
                rejectionReason: statusModal.reason,
                paymentProof: statusModal.paymentProof,
                adminComment: statusModal.adminComment
            });
            setStatusModal({ show: false, type: null, id: null, reason: '', paymentProof: '', adminComment: '', isProcessing: false });
            fetchDashboardData(true);
        } catch (error) {
            alert(error.response?.data?.message || 'Status update failed');
            setStatusModal(prev => ({ ...prev, isProcessing: false }));
        }
    };

    const handleUpdateWithdrawalStatus = (id, status) => {
        handleOpenStatusModal(id, status);
    };

    const handleCreateStory = async (e) => {
        e.preventDefault();
        setUploadingStory(true);
        try {
            if (editStoryId) {
                await api.patch(`/success-stories/${editStoryId}`, storyForm);
                alert('Success story updated!');
            } else {
                await api.post('/success-stories', storyForm);
                alert('Success story uploaded!');
            }
            setStoryForm({ title: '', category: '', raised: '', backers: '', image: '', quote: '', author: '', role: '' });
            setEditStoryId(null);
            fetchDashboardData(true);
        } catch (error) {
            alert(editStoryId ? 'Update failed' : 'Upload failed');
        } finally {
            setUploadingStory(false);
        }
    };

    const handleEditStory = (story) => {
        setEditStoryId(story._id);
        setStoryForm({
            title: story.title,
            category: story.category,
            raised: story.raised,
            backers: story.backers,
            image: story.image,
            quote: story.quote,
            author: story.author,
            role: story.role
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteStory = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/success-stories/${id}`);
            fetchDashboardData(true);
        } catch (error) {
            alert('Delete failed');
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdatingProfile(true);
        try {
            await api.patch('/auth/update-profile', profileForm);
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Profile update failed');
        } finally {
            setUpdatingProfile(false);
        }
    };

    useEffect(() => {
        if (user && activeTab === 'settings') {
            setProfileForm({
                bio: user.creatorProfile?.bio || '',
                website: user.creatorProfile?.website || '',
                socialLinks: {
                    facebook: user.creatorProfile?.socialLinks?.facebook || '',
                    twitter: user.creatorProfile?.socialLinks?.twitter || '',
                    linkedin: user.creatorProfile?.socialLinks?.linkedin || ''
                }
            });
        }
    }, [activeTab, user]);

    const SidebarLink = ({ id, icon: Icon, label }) => (
        <button 
            onClick={() => setSearchParams({ tab: id })}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === id 
                ? 'bg-custom-yellow text-custom-black shadow-lg shadow-yellow-500/20' 
                : 'text-gray-400 hover:bg-white/5 hover:text-custom-white'
            }`}
        >
            <Icon size={20} />
            {label}
        </button>
    );

    return (
        <div className="min-h-[calc(100vh-80px)] bg-custom-black flex flex-col lg:flex-row">
            {/* Sidebar */}
            <aside className="w-full lg:w-72 bg-custom-black border-r border-gray-800 p-6 space-y-2">
                <p className="px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Main Menu</p>
                <SidebarLink id="overview" icon={LayoutDashboard} label="Overview" />
                
                {isAdmin && (
                    <>
                        <p className="px-6 pt-6 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Admin Tools</p>
                        <SidebarLink id="approvals" icon={ShieldAlert} label="Campaign Approvals" />
                        <SidebarLink id="user-approvals" icon={CheckCircle} label="User Approvals" />
                        <SidebarLink id="users" icon={UsersIcon} label="User Management" />
                        <SidebarLink id="success-stories" icon={Rocket} label="Success Stories" />
                        <SidebarLink id="finance" icon={DollarSign} label="Finance" />
                        <SidebarLink id="fulfillment-monitor" icon={Eye} label="Fulfillment Monitor" />
                    </>
                )}

                {isCreator && (
                    <>
                        <p className="px-6 pt-6 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Creator Studio</p>
                        <SidebarLink id="my-projects" icon={Layers} label="My Projects" />
                        <SidebarLink id="updates" icon={Rocket} label="Campaign Updates" />
                        <SidebarLink id="backer-management" icon={UsersIcon} label="Backer Management" />
                        <SidebarLink id="contributions" icon={Wallet} label="Contributions" />
                        <SidebarLink id="withdrawals" icon={ArrowUpRight} label="Payments" />
                    </>
                )}

                <p className="px-6 pt-6 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Personal</p>
                <SidebarLink id="backed-projects" icon={Layers} label="Backed Projects" />
                <SidebarLink id="donations" icon={Heart} label="My Donations" />
                <SidebarLink id="settings" icon={Settings} label="Settings" />
            </aside>

            {/* Content Area */}
            <main className="flex-grow bg-gray-50 p-8 lg:p-12 overflow-y-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-custom-black mb-2 uppercase tracking-tighter">
                            {activeTab.replace('-', ' ')}
                        </h1>
                        <p className="text-gray-500 font-bold">Welcome to your command center, {user?.name}.</p>
                    </div>
                    {isCreator && (
                        <button onClick={() => navigate('/create-campaign')} className="bg-custom-black text-custom-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-custom-yellow hover:text-custom-black transition-all shadow-xl shadow-black/10">
                            <PlusCircle size={20} /> Launch New Project
                        </button>
                    )}
                </header>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-yellow"></div>
                        </div>
                    ) : tabLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-custom-blue"></div>
                            <p className="ml-4 font-black text-gray-400 uppercase tracking-widest text-xs">Updating {activeTab.replace('-', ' ')}...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'overview' && (
                                <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {isAdmin ? (
                                            <>
                                                <StatCard label="Platform Total" value="$12.4M" icon={TrendingUp} color="text-green-500" />
                                                <StatCard label="Active Users" value="1,240" icon={UsersIcon} color="text-custom-blue" />
                                                <StatCard label="Pending Projects" value={data.pendingApprovals.length} icon={Clock} color="text-custom-yellow" />
                                                <StatCard label="Pending Users" value={data.pendingUsers.length} icon={CheckCircle} color="text-custom-yellow" />
                                            </>
                                        ) : isCreator ? (
                                            <>
                                                <StatCard label="Total Raised" value={`$${data.campaigns.reduce((acc, c) => acc + c.totalRaised, 0)}`} icon={DollarSign} color="text-green-500" />
                                                <StatCard label="Active Projects" value={data.campaigns.length} icon={Layers} color="text-custom-yellow" />
                                                <StatCard label="Total Backers" value={data.campaigns.reduce((acc, c) => acc + c.backerCount, 0)} icon={UsersIcon} color="text-custom-blue" />
                                                <StatCard label="Donations Made" value={data.donations.length || "0"} icon={Heart} color="text-purple-500" />

                                                {/* Backer Profile Section for Creators */}
                                                <div className="col-span-full mt-8">
                                                    <h2 className="text-2xl font-black text-custom-black mb-6 flex items-center gap-3">
                                                        <Heart className="text-custom-blue" /> My Backer Profile
                                                    </h2>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-black/5">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Backed</p>
                                                            <p className="text-3xl font-black text-custom-blue">${data.donations.reduce((acc, d) => acc + d.amount, 0).toLocaleString()}</p>
                                                        </div>
                                                        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-black/5">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Projects Supported</p>
                                                            <p className="text-3xl font-black text-custom-yellow">{new Set(data.donations.map(d => d.campaignId?._id)).size}</p>
                                                        </div>
                                                        <div className="bg-custom-black p-8 rounded-[32px] text-white flex items-center justify-between group overflow-hidden relative">
                                                            <div className="relative z-10">
                                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Impact Level</p>
                                                                <p className="text-3xl font-black text-custom-yellow">Supporter</p>
                                                            </div>
                                                            <Rocket className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10 group-hover:text-custom-yellow/20 transition-all" size={64} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <StatCard label="Total Backed" value={`$${data.donations.reduce((acc, d) => acc + d.amount, 0).toLocaleString()}`} icon={Heart} color="text-custom-blue" />
                                                <StatCard label="Projects Supported" value={new Set(data.donations.map(d => d.campaignId?._id)).size} icon={Layers} color="text-custom-yellow" />
                                                <div className="col-span-1 md:col-span-2 bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-black/5 flex items-center justify-between group overflow-hidden relative">
                                                    <div className="relative z-10">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Impact Level</p>
                                                        <p className="text-4xl font-black text-custom-black">Supporter</p>
                                                    </div>
                                                    <div className="absolute right-0 top-0 h-full w-1/3 bg-custom-yellow/5 -skew-x-12 translate-x-1/2 group-hover:bg-custom-yellow/10 transition-all"></div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {isBackerOnly && (
                                        <section className="bg-custom-black p-12 rounded-[48px] text-custom-white relative overflow-hidden shadow-2xl">
                                            <div className="absolute top-0 right-0 w-96 h-96 bg-custom-yellow/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
                                            <div className="relative z-10 max-w-2xl">
                                                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase tracking-tighter">
                                                    BRING YOUR OWN <span className="text-custom-yellow">IDEAS</span> TO LIFE.
                                                </h2>
                                                <p className="text-gray-400 font-bold text-lg mb-10 leading-relaxed">
                                                    Apply to become a verified creator and start raising funds for your projects. Our team will verify your identity to maintain platform trust.
                                                </p>
                                                {user?.approvalStatus === 'pending' ? (
                                                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-4 w-fit">
                                                        <Clock className="text-custom-yellow" />
                                                        <p className="font-bold text-custom-yellow uppercase tracking-widest text-sm">Application Under Review</p>
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => setIsCreatorModalOpen(true)}
                                                        className="bg-custom-yellow text-custom-black px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-yellow-500/20 active:scale-95"
                                                    >
                                                        <PlusCircle size={24} /> BECOME A CREATOR
                                                    </button>
                                                )}
                                            </div>
                                        </section>
                                    )}

                                    {isAdmin && data.pendingApprovals.length > 0 && (
                                        <section>
                                            <h2 className="text-2xl font-black text-custom-black mb-6 flex items-center gap-3">
                                                <Clock className="text-custom-yellow" /> Pending Approvals
                                            </h2>
                                            <div className="grid gap-6">
                                                {data.pendingApprovals.map(campaign => (
                                                    <div key={campaign._id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-black/5 flex flex-col md:flex-row items-center justify-between gap-8">
                                                        <div className="flex items-center gap-6">
                                                            <img src={campaign.thumbnail} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                                                            <div>
                                                                <h3 className="text-xl font-black text-custom-black">{campaign.title}</h3>
                                                                <p className="text-sm font-bold text-gray-400 italic">By {campaign.creatorId?.name} • ${campaign.fundingGoal} Goal</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <button onClick={() => navigate(`/campaign/${campaign._id}`)} className="p-4 bg-gray-50 text-gray-400 hover:text-custom-black rounded-2xl transition-all"><Eye size={20}/></button>
                                                            <button onClick={() => handleApprove(campaign._id, false)} className="p-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"><XCircle size={20}/></button>
                                                            <button onClick={() => handleApprove(campaign._id, true)} className="px-8 py-4 bg-green-500 text-white font-black rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/20">APPROVE</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'approvals' && (
                                <motion.div key="approvals" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                    {data.pendingApprovals.length > 0 ? data.pendingApprovals.map(campaign => (
                                        <div key={campaign._id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-black/5 flex flex-col lg:flex-row items-center justify-between gap-8">
                                            <div className="flex items-center gap-6 flex-grow">
                                                <img src={campaign.thumbnail} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
                                                    <div>
                                                        <h3 className="text-xl font-black text-custom-black">{campaign.title}</h3>
                                                        <p className="text-sm font-bold text-gray-400 italic">By {campaign.creatorId?.name} • ${campaign.fundingGoal} Goal</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                            campaign.status === 'active' ? 'bg-green-100 text-green-600' : 
                                                            campaign.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                                            campaign.status === 'banned' ? 'bg-red-100 text-red-600' :
                                                            'bg-gray-100 text-gray-600'
                                                        }`}>
                                                            {campaign.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => navigate(`/campaign/${campaign._id}`)} className="p-4 bg-gray-50 text-gray-400 hover:text-custom-black rounded-2xl transition-all" title="View"><Eye size={20}/></button>
                                                
                                                {campaign.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => handleApprove(campaign._id, false)} className="p-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all" title="Reject"><XCircle size={20}/></button>
                                                        <button onClick={() => handleApprove(campaign._id, true)} className="px-8 py-4 bg-green-500 text-white font-black rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/20">APPROVE</button>
                                                    </>
                                                )}

                                                {campaign.status !== 'successful' && (
                                                    <button 
                                                        onClick={() => handleToggleCampaignBan(campaign._id)}
                                                        className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                                                            campaign.status === 'banned' 
                                                            ? 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white' 
                                                            : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'
                                                        }`}
                                                    >
                                                        {campaign.status === 'banned' ? 'Restore' : 'Ban'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                                            <p className="text-gray-400 font-bold uppercase tracking-widest">No campaigns to display</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'user-approvals' && (
                                <motion.div key="user-approvals" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                    {data.pendingUsers.length > 0 ? data.pendingUsers.map(u => (
                                        <div key={u._id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-black/5 flex flex-col lg:flex-row items-center justify-between gap-8">
                                            <div className="flex items-center gap-6 flex-grow">
                                                <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                                                    {u.profilePicture?.data ? (
                                                        <img 
                                                            src={`data:${u.profilePicture.contentType};base64,${u.profilePicture.data}`} 
                                                            alt="" 
                                                            className="w-full h-full object-cover" 
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center font-black text-gray-300 text-2xl uppercase">{u.name[0]}</div>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-grow">
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">User Info</p>
                                                        <h3 className="text-xl font-black text-custom-black">{u.name}</h3>
                                                        <p className="text-sm font-bold text-gray-500">{u.email}</p>
                                                        <p className="text-xs font-bold text-custom-blue">{u.phone}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">National ID</p>
                                                        <p className="text-sm font-black text-custom-black bg-gray-50 px-3 py-1 rounded-lg w-fit">{u.nid || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Physical Address</p>
                                                        <p className="text-sm font-bold text-gray-500 leading-snug">{u.address || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button 
                                                    disabled={processingReg === u._id}
                                                    onClick={() => handleApproveRegistration(u._id, false)} 
                                                    className="p-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                                                >
                                                    <XCircle size={20}/>
                                                </button>
                                                <button 
                                                    disabled={processingReg === u._id}
                                                    onClick={() => handleApproveRegistration(u._id, true)} 
                                                    className="px-8 py-4 bg-green-500 text-white font-black rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                                                >
                                                    {processingReg === u._id ? '...' : 'APPROVE'}
                                                </button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                                            <p className="text-gray-400 font-bold uppercase tracking-widest">No pending user registrations</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'users' && (
                                <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-black/5 overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-100">
                                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {data.users.length > 0 ? (
                                                    data.users.map(u => (
                                                        <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                                                            <td className="px-8 py-6">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-full bg-custom-yellow/20 flex items-center justify-center font-black text-custom-yellow">
                                                                        {u.name[0]}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-black text-custom-black">{u.name}</p>
                                                                        <p className="text-xs font-bold text-gray-400">{u.email}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-6">
                                                                <div className="flex gap-1">
                                                                    {u.role.map(r => (
                                                                        <span key={r} className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                                            {r}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-6">
                                                                {u.isBanned ? (
                                                                    <span className="text-red-500 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                                                        <ShieldAlert size={14} /> Banned
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-green-500 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                                                        <CheckCircle size={14} /> Active
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-8 py-6 text-sm font-bold text-gray-400">
                                                                {new Date(u.createdAt).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-8 py-6 text-right">
                                                                <button 
                                                                    disabled={processingUser === u._id}
                                                                    onClick={() => handleToggleBan(u._id)}
                                                                    className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                                                                        processingUser === u._id 
                                                                        ? 'bg-gray-100 text-gray-400 cursor-wait'
                                                                        : u.isBanned 
                                                                        ? 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white' 
                                                                        : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'
                                                                    }`}
                                                                >
                                                                    {processingUser === u._id ? 'Processing...' : (u.isBanned ? 'Unban' : 'Ban')}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="px-8 py-20 text-center">
                                                            <p className="text-gray-400 font-bold uppercase tracking-widest">No users found</p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'success-stories' && (
                                <motion.div key="stories" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                                    {/* Upload Form */}
                                    <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-black/5">
                                        <h2 className="text-2xl font-black text-custom-black mb-8 flex items-center gap-3">
                                            {editStoryId ? <Pencil className="text-custom-yellow" /> : <PlusCircle className="text-custom-yellow" />} 
                                            {editStoryId ? 'Edit Success Story' : 'Upload New Story'}
                                        </h2>
                                        <form onSubmit={handleCreateStory} className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Story Title</label>
                                                <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={storyForm.title} onChange={e => setStoryForm({...storyForm, title: e.target.value})} placeholder="e.g. The Solar Revolution" />
                                                    </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Category</label>
                                                <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={storyForm.category} onChange={e => setStoryForm({...storyForm, category: e.target.value})} placeholder="e.g. Technology" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Amount Raised</label>
                                                <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={storyForm.raised} onChange={e => setStoryForm({...storyForm, raised: e.target.value})} placeholder="e.g. $124,500" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Total Backers</label>
                                                <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={storyForm.backers} onChange={e => setStoryForm({...storyForm, backers: e.target.value})} placeholder="e.g. 1,240" />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Thumbnail URL</label>
                                                <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={storyForm.image} onChange={e => setStoryForm({...storyForm, image: e.target.value})} placeholder="https://..." />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Inspirational Quote</label>
                                                <textarea required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-6 rounded-3xl font-bold transition-all min-h-[120px]" value={storyForm.quote} onChange={e => setStoryForm({...storyForm, quote: e.target.value})} placeholder="Share the impact..." />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Author Name</label>
                                                <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={storyForm.author} onChange={e => setStoryForm({...storyForm, author: e.target.value})} placeholder="e.g. John Doe" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Author Role</label>
                                                <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={storyForm.role} onChange={e => setStoryForm({...storyForm, role: e.target.value})} placeholder="e.g. CEO, EcoTech" />
                                            </div>
                                            <div className="md:col-span-2 flex gap-4">
                                                <button disabled={uploadingStory} type="submit" className="flex-grow bg-custom-black text-custom-white py-5 rounded-2xl font-black text-lg hover:bg-custom-yellow hover:text-custom-black transition-all shadow-xl shadow-black/10 disabled:opacity-50">
                                                    {uploadingStory ? 'SAVING...' : (editStoryId ? 'UPDATE STORY' : 'PUBLISH SUCCESS STORY')}
                                                </button>
                                                {editStoryId && (
                                                    <button type="button" onClick={() => { setEditStoryId(null); setStoryForm({ title: '', category: '', raised: '', backers: '', image: '', quote: '', author: '', role: '' }); }} className="bg-gray-200 text-gray-600 px-8 py-5 rounded-2xl font-black text-lg hover:bg-gray-300 transition-all">
                                                        CANCEL
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    </section>

                                    {/* Stories List */}
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {data.stories.map(story => (
                                            <div key={story._id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-xl shadow-black/5 flex gap-6 items-center">
                                                <img src={story.image} className="w-24 h-24 rounded-2xl object-cover" alt="" />
                                                <div className="flex-grow">
                                                    <h3 className="font-black text-custom-black leading-tight mb-1">{story.title}</h3>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{story.category}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEditStory(story)} className="p-4 bg-gray-50 text-gray-400 hover:text-custom-black rounded-2xl transition-all"><Pencil size={20}/></button>
                                                    <button onClick={() => handleDeleteStory(story._id)} className="p-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"><Trash2 size={20}/></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'finance' && (
                                <motion.div key="finance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                    {/* Finance Sub-Tabs */}
                                    <div className="flex gap-4 p-1 bg-gray-200/50 rounded-2xl w-fit">
                                        <button 
                                            onClick={() => setFinanceSubTab('donations')}
                                            className={`px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
                                                financeSubTab === 'donations' 
                                                ? 'bg-white text-custom-black shadow-md' 
                                                : 'text-gray-500 hover:text-custom-black'
                                            }`}
                                        >
                                            Global Donations
                                        </button>
                                        <button 
                                            onClick={() => setFinanceSubTab('payments')}
                                            className={`px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
                                                financeSubTab === 'payments' 
                                                ? 'bg-white text-custom-black shadow-md' 
                                                : 'text-gray-500 hover:text-custom-black'
                                            }`}
                                        >
                                            Global Withdrawals
                                        </button>
                                    </div>

                                    {/* Data Table */}
                                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-black/5 overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead>
                                            <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                {financeSubTab === 'donations' ? 'Donor / Project' : 'Creator / Project'}
                                            </th>
                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{financeSubTab === 'donations' ? 'Amount' : 'Net Payout'}</th>
                                            {financeSubTab === 'payments' && <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Breakdown</th>}
                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Gateway / Method</th>
                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Date</th>
                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                            {financeSubTab === 'donations' ? (
                                            data.allDonations.length > 0 ? data.allDonations.map(d => (
                                                <tr key={d._id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-custom-blue/10 flex items-center justify-center font-black text-custom-blue">
                                                                {d.isAnonymous ? 'A' : (d.backerId?.name?.[0] || '?')}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-custom-black">
                                                                    {d.isAnonymous ? 'Anonymous Donor' : (d.backerId?.name || 'Unknown User')}
                                                                </p>
                                                                <p className="text-xs font-bold text-gray-400 truncate max-w-[200px]">
                                                                    {d.campaignId?.title || 'Deleted Campaign'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <p className="font-black text-custom-black">{d.amount} {d.currency}</p>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{d.payment?.gateway}</span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                            d.status === 'charged' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                                        }`}>
                                                            {d.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right text-xs font-bold text-gray-400">
                                                        {new Date(d.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                       -
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="6" className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest">No donations found</td></tr>
                                            )
                                            ) : (
                                            data.allWithdrawals.length > 0 ? data.allWithdrawals.map(w => (
                                                <tr key={w._id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-custom-yellow/10 flex items-center justify-center font-black text-custom-yellow">
                                                                {w.creatorId?.name?.[0] || '?'}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-custom-black">{w.creatorId?.name || 'Unknown Creator'}</p>
                                                                <p className="text-xs font-bold text-gray-400 truncate max-w-[200px]">{w.campaignId?.title || 'Deleted Campaign'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-6">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <p className="font-black text-custom-black">${w.netAmount?.toLocaleString()}</p>
                                                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter ${
                                                                w.stage === 1 ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                                                            }`}>
                                                                Stage {w.stage || 1} ({w.stage === 2 ? '30%' : '70%'})
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-center">
                                                        <div className="flex flex-col items-center gap-0.5">
                                                            <p className="text-[10px] font-bold text-green-600 uppercase tracking-tighter">Gross: ${w.requestedAmount?.toLocaleString()}</p>
                                                            <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Fee: -${w.platformFee?.toLocaleString()}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{w.method} • {w.accountNumber}</span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                            w.status === 'completed' ? 'bg-green-100 text-green-600' : 
                                                            w.status === 'rejected' ? 'bg-red-100 text-red-600' : 
                                                            w.status === 'approved' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
                                                        }`}>
                                                            {w.status}
                                                        </span>
                                                        {w.rejectionReason && <p className="text-[9px] text-red-400 mt-1 font-bold">Reason: {w.rejectionReason}</p>}
                                                    </td>
                                                    <td className="px-8 py-6 text-right text-xs font-bold text-gray-400">
                                                        {new Date(w.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                       {w.status === 'pending' && (
                                                           <div className="flex justify-end gap-2">
                                                               <button 
                                                                   disabled={updatingBackerStatus === w._id}
                                                                   onClick={() => handleUpdateWithdrawalStatus(w._id, 'rejected')} 
                                                                   className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                                               >
                                                                   <XCircle size={16}/>
                                                               </button>
                                                               <button 
                                                                   disabled={updatingBackerStatus === w._id}
                                                                   onClick={() => handleUpdateWithdrawalStatus(w._id, 'approved')} 
                                                                   className="px-3 py-1 bg-green-500 text-white font-black text-[10px] rounded-lg hover:bg-green-600 transition-all"
                                                               >
                                                                   APPROVE
                                                               </button>
                                                           </div>
                                                       )}
                                                       {w.status === 'approved' && (
                                                           <button 
                                                               disabled={updatingBackerStatus === w._id}
                                                               onClick={() => handleUpdateWithdrawalStatus(w._id, 'completed')} 
                                                               className="px-3 py-1 bg-custom-black text-custom-white font-black text-[10px] rounded-lg hover:bg-custom-yellow hover:text-custom-black transition-all"
                                                           >
                                                               MARK COMPLETE
                                                           </button>
                                                       )}
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="7" className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest">No withdrawals found</td></tr>
                                            )
                                            )}                                                    </tbody>                                        </table>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'contributions' && (
                                <motion.div key="contributions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-black/5 overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-100">
                                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Backer / Project</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {data.contributions.length > 0 ? data.contributions.map(c => (
                                                    <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-full bg-custom-blue/10 flex items-center justify-center font-black text-custom-blue">
                                                                    {c.isAnonymous ? 'A' : (c.backerId?.name?.[0] || '?')}
                                                                </div>
                                                                <div>
                                                                    <p className="font-black text-custom-black">
                                                                        {c.isAnonymous ? 'Anonymous Donor' : (c.backerId?.name || 'Unknown User')}
                                                                    </p>
                                                                    <p className="text-xs font-bold text-gray-400 truncate max-w-[200px]">
                                                                        {c.campaignId?.title || 'Deleted Campaign'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <p className="font-black text-custom-black">{c.amount} {c.currency}</p>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{c.payment?.gateway}</span>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                                c.status === 'charged' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                                            }`}>
                                                                {c.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6 text-right text-xs font-bold text-gray-400">
                                                            {new Date(c.createdAt).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="5" className="px-8 py-20 text-center">
                                                            <p className="text-gray-400 font-bold uppercase tracking-widest">No contributions found yet</p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'my-projects' && (
                                <motion.div key="projects" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-8">
                                    {data.campaigns.length > 0 ? data.campaigns.map(campaign => (
                                        <div key={campaign._id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-black/5">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                    campaign.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-custom-yellow/20 text-custom-yellow'
                                                }`}>
                                                    {campaign.status}
                                                </div>
                                                <button 
                                                    onClick={() => navigate(`/edit-campaign/${campaign._id}`)}
                                                    className="text-gray-400 hover:text-custom-black transition-all"
                                                >
                                                    <Settings size={20}/>
                                                </button>
                                            </div>
                                            <h3 className="text-2xl font-black text-custom-black mb-4">{campaign.title}</h3>
                                            <div className="space-y-4">
                                                <div className="flex justify-between text-sm font-bold">
                                                    <span className="text-gray-400 uppercase tracking-widest">Raised</span>
                                                    <span className="text-custom-blue">${campaign.totalRaised} / ${campaign.fundingGoal}</span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-custom-blue" style={{ width: `${(campaign.totalRaised/campaign.fundingGoal)*100}%` }} />
                                                </div>
                                            </div>
                                            <div className="mt-8 pt-8 border-t border-gray-50 flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <UsersIcon size={16} className="text-gray-400" />
                                                    <span className="font-bold text-sm text-gray-500">{campaign.backerCount} Backers</span>
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
                                                            className="bg-green-500 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 transition-all"
                                                        >
                                                            Promote to Success Story
                                                        </button>
                                                    )}
                                                    <button onClick={() => navigate(`/campaign/${campaign._id}`)} className="text-custom-black font-black text-sm hover:underline">View Public Page</button>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                                            <p className="text-gray-400 font-bold uppercase tracking-widest">No projects found</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'backed-projects' && (
                                <motion.div key="backed-projects" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                    {Array.from(new Set(data.donations.map(d => d.campaignId?._id))).map(campaignId => {
                                        const projectDonations = data.donations.filter(d => d.campaignId?._id === campaignId);
                                        const campaign = projectDonations[0].campaignId;
                                        const totalContributed = projectDonations.reduce((acc, d) => acc + d.amount, 0);
                                        const isCampaignEnded = new Date(campaign.deadline) < new Date();

                                        return (
                                            <div key={campaignId} className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-black/5 overflow-hidden group">
                                                <div className="p-8 md:p-10 flex flex-col md:flex-row gap-10">
                                                    <img src={campaign.thumbnail} className="w-full md:w-64 h-64 md:h-48 rounded-[32px] object-cover" alt="" />
                                                    <div className="flex-grow space-y-6">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="text-3xl font-black text-custom-black uppercase tracking-tighter">{campaign.title}</h3>
                                                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">By {campaign.creatorId?.name}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Contributed</p>
                                                                <p className="text-3xl font-black text-custom-blue">${totalContributed}</p>
                                                            </div>
                                                        </div>

                                                        {/* Reward Tiers Reached */}
                                                        <div className="space-y-4">
                                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                                <Rocket size={14} className="text-custom-yellow" /> Reward Tiers Reached
                                                            </p>
                                                            <div className="flex flex-wrap gap-3">
                                                                {campaign.rewardTiers?.filter(tier => totalContributed >= tier.minimumAmount).map(tier => {
                                                                    const relevantDonation = projectDonations.find(d => d.rewardDelivery?.fulfilledRewardTierIds?.includes(tier._id));
                                                                    const isFulfilled = !!relevantDonation;
                                                                    const isConfirmed = relevantDonation?.rewardDelivery?.confirmedRewardTierIds?.includes(tier._id);
                                                                    
                                                                    return (
                                                                        <div key={tier._id} className="bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 flex items-center justify-between gap-4">
                                                                            <div>
                                                                                <p className="font-black text-custom-black text-sm">{tier.title}</p>
                                                                                <div className="flex items-center gap-2 mt-2">
                                                                                    <span className={`w-2 h-2 rounded-full ${isFulfilled ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                                                        {isConfirmed ? 'CONFIRMED' : isFulfilled ? 'FULFILLED' : 'PENDING'}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            {isFulfilled && !isConfirmed && (
                                                                                <button 
                                                                                    disabled={confirmingDelivery}
                                                                                    onClick={() => handleConfirmDelivery(relevantDonation._id, tier._id)}
                                                                                    className="bg-custom-yellow text-custom-black px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-md"
                                                                                >
                                                                                    {confirmingDelivery ? '...' : 'Confirm Receipt'}
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                                {campaign.rewardTiers?.filter(tier => totalContributed >= tier.minimumAmount).length === 0 && (
                                                                    <p className="text-xs font-bold text-gray-400 italic">No tiers reached yet</p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Delivery Status */}
                                                        <div className="pt-6 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                                                            <div>
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Project Progress</p>
                                                                <div className="flex items-center gap-4">
                                                                    <div className={`p-4 rounded-2xl ${isCampaignEnded ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                                                        {isCampaignEnded ? <CheckCircle size={24} /> : <Clock size={24} />}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-black text-custom-black uppercase text-sm">{isCampaignEnded ? 'Campaign Ended' : 'Funding Period'}</p>
                                                                        <p className="text-xs font-bold text-gray-400">
                                                                            {isCampaignEnded ? 'Rewards will be fulfilled soon' : `Ends on ${new Date(campaign.deadline).toLocaleDateString()}`}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {isCampaignEnded && (
                                                                <div>
                                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Fulfillment Status</p>
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="p-4 bg-custom-yellow/10 text-custom-yellow rounded-2xl">
                                                                            <Rocket size={24} />
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-black text-custom-black uppercase text-sm">
                                                                                {campaign.rewardProgressStatus?.replace('_', ' ') || 'Preparing'}
                                                                            </p>
                                                                            <p className="text-xs font-bold text-gray-400">
                                                                                {campaign.rewardProgressNote || 'Estimated 2-3 weeks for manufacturing'}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {data.donations.length === 0 && (
                                        <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                                            <p className="text-gray-400 font-bold uppercase tracking-widest">No backed projects found</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'backer-management' && (
                                <motion.div key="backer-management" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                    {!selectedCampaignForBackers ? (
                                        <div className="grid md:grid-cols-2 gap-8">
                                            {data.campaigns.map(c => (
                                                <div key={c._id} onClick={() => handleFetchBackers(c._id)} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-black/5 cursor-pointer hover:border-custom-yellow transition-all group">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <h3 className="text-2xl font-black text-custom-black group-hover:text-custom-yellow transition-colors">{c.title}</h3>
                                                        <ArrowUpRight className="text-gray-300 group-hover:text-custom-yellow" />
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className="text-center">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Backers</p>
                                                            <p className="text-2xl font-black text-custom-black">{c.backerCount}</p>
                                                        </div>
                                                        <div className="w-px h-10 bg-gray-100" />
                                                        <div className="text-center">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Raised</p>
                                                            <p className="text-2xl font-black text-custom-blue">${c.totalRaised}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-10">
                                            <button onClick={() => setSelectedCampaignForBackers(null)} className="flex items-center gap-2 text-gray-400 font-black uppercase text-xs tracking-widest hover:text-custom-black transition-all">
                                                <XCircle size={16} /> Back to Projects
                                            </button>

                                            {/* Campaign Progress Control */}
                                            <section className="bg-custom-black p-10 rounded-[40px] text-custom-white">
                                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                                                    <Rocket className="text-custom-yellow" /> Global Fulfillment Progress
                                                </h3>
                                                <form onSubmit={handleUpdateCampaignProgress} className="grid md:grid-cols-3 gap-6 items-end">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Current Stage</label>
                                                        <select name="status" className="w-full bg-white/5 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all text-custom-white" defaultValue={data.campaignBackers?.campaign?.rewardProgressStatus || 'not_started'}>
                                                            <option value="not_started" className="bg-custom-black">Not Started</option>
                                                            <option value="manufacturing" className="bg-custom-black">Manufacturing</option>
                                                            <option value="warehouse" className="bg-custom-black">In Warehouse</option>
                                                            <option value="transported" className="bg-custom-black">Transported to Destination</option>
                                                            <option value="delivered" className="bg-custom-black">All Delivered</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2 md:col-span-1">
                                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Estimated Info / Note</label>
                                                        <input name="note" className="w-full bg-white/5 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all text-custom-white" defaultValue={data.campaignBackers?.campaign?.rewardProgressNote || ''} placeholder="e.g. Estimated 2-3 days" />
                                                    </div>
                                                    <button disabled={updatingCampaignProgress} type="submit" className="bg-custom-yellow text-custom-black py-4 px-8 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-yellow-500/20">
                                                        {updatingCampaignProgress ? 'Updating...' : 'Update Progress'}
                                                    </button>
                                                </form>
                                            </section>

                                            {/* Backer Tabs */}
                                            <div className="flex gap-4 p-1 bg-gray-200/50 rounded-2xl w-fit">
                                                <button onClick={() => setBackerStatusFilter('remaining')} className={`px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${backerStatusFilter === 'remaining' ? 'bg-white text-custom-black shadow-md' : 'text-gray-500 hover:text-custom-black'}`}>Remaining</button>
                                                        <button onClick={() => setBackerStatusFilter('sent')} className={`px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${backerStatusFilter === 'sent' ? 'bg-white text-custom-black shadow-md' : 'text-gray-500 hover:text-custom-black'}`}>Rewards Sent</button>
                                            </div>

                                            {/* Backer List grouped by Tier */}
                                            <div className="space-y-12">
                                                {data.campaignBackers?.rewardTiers.map(tier => {
                                                    const tierBackers = data.campaignBackers?.backers.filter(b => 
                                                        b.matchedTiers.some(t => t._id === tier._id) &&
                                                        (backerStatusFilter === 'sent' 
                                                            ? b.donations.some(d => (d.rewardDelivery.status === 'sent' || d.rewardDelivery.status === 'delivered'))
                                                            : b.donations.some(d => (d.rewardDelivery.status === 'pending' || d.rewardDelivery.status === 'shipped'))
                                                        )
                                                    );

                                                    if (tierBackers.length === 0) return null;

                                                    return (
                                                        <div key={tier._id} className="space-y-6">
                                                            <div className="flex items-center gap-4 ml-4">
                                                                <div className="w-12 h-12 rounded-2xl bg-custom-yellow/20 flex items-center justify-center font-black text-custom-yellow text-xl">
                                                                    ${tier.minimumAmount}
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-xl font-black text-custom-black uppercase tracking-tighter">{tier.title}</h4>
                                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{tier.type} Reward • {tierBackers.length} Backers</p>
                                                                </div>
                                                            </div>

                                                            <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-black/5 overflow-hidden">
                                                                <table className="w-full text-left">
                                                                    <thead>
                                                                        <tr className="bg-gray-50 border-b border-gray-100">
                                                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Backer</th>
                                                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery Info</th>
                                                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                                                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-gray-50">
                                                                        {tierBackers.map(b => (
                                                                            <tr key={b.backer._id} className="hover:bg-gray-50/50 transition-colors">
                                                                                <td className="px-8 py-6">
                                                                                    <p className="font-black text-custom-black">{b.backer.name}</p>
                                                                                    <p className="text-xs font-bold text-gray-400">{b.backer.email}</p>
                                                                                </td>
                                                                                <td className="px-8 py-6">
                                                                                    {tier.type === 'email' ? (
                                                                                        <span className="text-xs font-bold text-custom-blue">Will be sent to email</span>
                                                                                    ) : (
                                                                                        <p className="text-xs font-bold text-gray-500 max-w-[200px] leading-snug">{b.backer.address || 'No address provided'}</p>
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-8 py-6">
                                                                                    <p className="font-black text-custom-black">${b.totalContributed}</p>
                                                                                </td>
                                                                                <td className="px-8 py-6 text-right">
                                                                                    {b.donations.map(d => {
                                                                                        const isFulfilled = d.rewardDelivery?.fulfilledRewardTierIds?.includes(tier._id);
                                                                                        return (
                                                                                            <button 
                                                                                                key={d._id}
                                                                                                disabled={updatingBackerStatus === `${d._id}-${tier._id}`}
                                                                                                onClick={() => handleUpdateBackerStatus(d._id, tier._id, !isFulfilled)}
                                                                                                className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                                                                                    isFulfilled
                                                                                                    ? 'bg-green-50 text-green-600 border border-green-100'
                                                                                                    : 'bg-custom-yellow text-custom-black hover:scale-105'
                                                                                                }`}
                                                                                            >
                                                                                                {updatingBackerStatus === `${d._id}-${tier._id}` ? '...' : (isFulfilled ? 'FULFILLED' : `MARK AS ${tier.type === 'email' ? 'SENT' : 'DELIVERED'}`)}
                                                                                            </button>
                                                                                        );
                                                                                    })}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'updates' && (
                                <motion.div key="updates" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                                    <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-black/5">
                                        <h2 className="text-2xl font-black text-custom-black mb-8 flex items-center gap-3">
                                            <Rocket className="text-custom-yellow" /> Post Campaign Update
                                        </h2>
                                        <form onSubmit={handlePostUpdate} className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Select Project</label>
                                                    <select 
                                                        required
                                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all"
                                                        value={updateForm.campaignId}
                                                        onChange={(e) => fetchUpdatesForCampaign(e.target.value)}
                                                    >
                                                        <option value="">-- Choose a Campaign --</option>
                                                        {data.campaigns.map(c => (
                                                            <option key={c._id} value={c._id}>{c.title}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Update Title</label>
                                                    <input 
                                                        required
                                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all"
                                                        value={updateForm.title}
                                                        onChange={(e) => setUpdateForm({...updateForm, title: e.target.value})}
                                                        placeholder="e.g. Prototype is ready!"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Content</label>
                                                <textarea 
                                                    required
                                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-6 rounded-3xl font-bold transition-all min-h-[160px]"
                                                    value={updateForm.content}
                                                    onChange={(e) => setUpdateForm({...updateForm, content: e.target.value})}
                                                    placeholder="Share the details with your backers..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Image URLs (comma separated)</label>
                                                <input 
                                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all"
                                                    value={updateForm.images}
                                                    onChange={(e) => setUpdateForm({...updateForm, images: e.target.value})}
                                                    placeholder="https://image1.jpg, https://image2.jpg"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer w-fit" onClick={() => setUpdateForm({...updateForm, isBackerOnly: !updateForm.isBackerOnly})}>
                                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${updateForm.isBackerOnly ? 'bg-custom-yellow border-custom-yellow' : 'border-gray-300'}`}>
                                                    {updateForm.isBackerOnly && <CheckCircle size={14} className="text-custom-black" />}
                                                </div>
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Backers Only Update</span>
                                            </div>
                                            <button 
                                                disabled={postingUpdate || !updateForm.campaignId}
                                                type="submit"
                                                className="w-full bg-custom-black text-custom-white py-5 rounded-2xl font-black text-lg hover:bg-custom-yellow hover:text-custom-black transition-all shadow-xl shadow-black/10 disabled:opacity-50"
                                            >
                                                {postingUpdate ? 'POSTING...' : 'PUBLISH UPDATE'}
                                            </button>
                                        </form>
                                    </div>

                                    {updateForm.campaignId && (
                                        <div className="space-y-6">
                                            <h3 className="text-2xl font-black text-custom-black ml-4">Existing Updates</h3>
                                            {data.updates.length > 0 ? data.updates.map(upd => (
                                                <div key={upd._id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-black/5 flex justify-between items-center">
                                                    <div className="flex gap-6 items-center">
                                                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-gray-400">
                                                            {upd.images?.[0] ? <img src={upd.images[0]} className="w-full h-full object-cover rounded-2xl" /> : <Newspaper />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-black text-custom-black">{upd.title}</h4>
                                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                                {new Date(upd.createdAt).toLocaleDateString()} • {upd.isBackerOnly ? 'Backers Only' : 'Public'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleDeleteUpdate(upd._id)}
                                                        className="p-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            )) : (
                                                <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                                                    <p className="text-gray-400 font-bold uppercase tracking-widest">No updates found for this project</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'withdrawals' && (
                                <motion.div key="withdrawals" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                    {!selectedCampaignForWithdrawal ? (
                                        <div className="grid md:grid-cols-2 gap-8">
                                            {data.campaigns.map(c => (
                                                <div key={c._id} onClick={() => fetchWithdrawalStats(c._id)} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-black/5 cursor-pointer hover:border-custom-yellow transition-all group">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <h3 className="text-2xl font-black text-custom-black group-hover:text-custom-yellow transition-colors">{c.title}</h3>
                                                        <ArrowUpRight className="text-gray-300 group-hover:text-custom-yellow" />
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className="text-center">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Raised</p>
                                                            <p className="text-2xl font-black text-custom-blue">${c.totalRaised}</p>
                                                        </div>
                                                        <div className="w-px h-10 bg-gray-100" />
                                                        <div className="text-center">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                                            <p className="text-xl font-black text-custom-yellow uppercase tracking-tight">{c.status}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-10">
                                            <button onClick={() => { setSelectedCampaignForWithdrawal(null); setWithdrawalStats(null); }} className="flex items-center gap-2 text-gray-400 font-black uppercase text-xs tracking-widest hover:text-custom-black transition-all">
                                                <XCircle size={16} /> Back to Projects
                                            </button>

                                            {/* Financial Studio Breakdown */}
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                <div className="lg:col-span-2 space-y-8">
                                                    <div className="bg-custom-black p-10 rounded-[40px] text-custom-white relative overflow-hidden">
                                                        <div className="relative z-10">
                                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Available for Withdrawal Now</p>
                                                            <p className="text-6xl font-black text-custom-yellow tracking-tighter">${withdrawalStats?.currentAvailable?.toLocaleString()}</p>
                                                            <div className="mt-8 flex flex-wrap gap-4">
                                                                <button 
                                                                    onClick={() => setShowPayoutModal(true)}
                                                                    className="bg-custom-yellow text-custom-black px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-yellow-500/20"
                                                                >
                                                                    <ArrowUpRight size={24} /> Request Payout
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <DollarSign className="absolute right-[-20px] bottom-[-20px] text-white/5 w-64 h-64 rotate-12" />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className={`p-8 rounded-[32px] border-2 transition-all ${withdrawalStats?.stage1?.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                                                            <div className="flex justify-between items-start mb-4">
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stage 1: Operation Funds (70%)</p>
                                                                {withdrawalStats?.stage1?.unlocked ? <CheckCircle className="text-green-500" /> : <Clock className="text-gray-300" />}
                                                            </div>
                                                            <p className="text-3xl font-black text-custom-black">${withdrawalStats?.stage1?.total?.toLocaleString()}</p>
                                                            <p className="text-xs font-bold text-gray-500 mt-2">Unlocked when campaign ends successfully.</p>
                                                        </div>
                                                        <div className={`p-8 rounded-[32px] border-2 transition-all ${withdrawalStats?.stage2?.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                                                            <div className="flex justify-between items-start mb-4">
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stage 2: Final Payout (30%)</p>
                                                                {withdrawalStats?.stage2?.unlocked ? <CheckCircle className="text-green-500" /> : <ShieldAlert className="text-red-300" />}
                                                            </div>
                                                            <p className="text-3xl font-black text-custom-black">${withdrawalStats?.stage2?.total?.toLocaleString()}</p>
                                                            <div className="mt-4 space-y-2">
                                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                                    <span>Backer Confirmations</span>
                                                                    <span>{withdrawalStats?.stage2?.confirmationRate}% / 80%</span>
                                                                </div>
                                                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-custom-blue transition-all" style={{ width: `${Math.min(100, (withdrawalStats?.stage2?.confirmationRate / 80) * 100)}%` }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-8">
                                                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-black/5">
                                                        <h4 className="text-sm font-black text-custom-black uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Funding Summary</h4>
                                                        <div className="space-y-4">
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-400 font-bold">Gross Raised</span>
                                                                <span className="font-black text-custom-black">${withdrawalStats?.totalRaised?.toLocaleString()}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-400 font-bold">Platform Fee (10%)</span>
                                                                <span className="font-black text-red-500">-${(withdrawalStats?.totalRaised - withdrawalStats?.netFunds)?.toLocaleString()}</span>
                                                            </div>
                                                            <div className="h-px bg-gray-100 my-2" />
                                                            <div className="flex justify-between text-lg">
                                                                <span className="text-custom-black font-black uppercase tracking-tighter">Net Funds</span>
                                                                <span className="font-black text-custom-blue">${withdrawalStats?.netFunds?.toLocaleString()}</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm text-gray-400 mt-4">
                                                                <span className="font-bold italic">Total Withdrawn</span>
                                                                <span className="font-black">${withdrawalStats?.totalWithdrawn?.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-blue-50 p-8 rounded-[32px] border border-blue-100">
                                                        <div className="flex items-center gap-3 mb-4 text-custom-blue">
                                                            <ShieldAlert size={20} />
                                                            <h4 className="font-black text-xs uppercase tracking-widest">Trust Policy</h4>
                                                        </div>
                                                        <p className="text-xs font-bold text-blue-800 leading-relaxed">
                                                            Funds are released in a 70/30 split to protect backers. Confirm your rewards are delivered to unlock the final 30%.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <h2 className="text-2xl font-black text-custom-black flex items-center gap-3 ml-4">
                                                <Clock className="text-custom-blue" /> Project Transaction History
                                            </h2>
                                            <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-black/5 overflow-hidden">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="bg-gray-50 border-b border-gray-100">
                                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Net Payout</th>
                                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Breakdown</th>
                                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Method</th>
                                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50 text-[13px]">
                                                        {data.withdrawals.filter(w => w.campaignId?._id === selectedCampaignForWithdrawal).length > 0 ? (
                                                            data.withdrawals.filter(w => w.campaignId?._id === selectedCampaignForWithdrawal).map(w => (
                                                                <React.Fragment key={w._id}>
                                                                    <tr 
                                                                        onClick={() => setExpandedWithdrawal(expandedWithdrawal === w._id ? null : w._id)}
                                                                        className={`hover:bg-gray-50/50 transition-all cursor-pointer ${expandedWithdrawal === w._id ? 'bg-gray-50/80' : ''}`}
                                                                    >
                                                                        <td className="px-8 py-6">
                                                                            <div className="flex items-center gap-2">
                                                                                <p className="font-black text-custom-black">${w.netAmount?.toLocaleString()}</p>
                                                                                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter ${
                                                                                    w.stage === 1 ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                                                                                }`}>
                                                                                    Stage {w.stage || 1} ({w.stage === 2 ? '30%' : '70%'})
                                                                                </span>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-8 py-6 text-center">
                                                                            <div className="flex flex-col items-center gap-0.5">
                                                                                <p className="text-[10px] font-bold text-green-600 uppercase tracking-tighter">Gross: ${w.requestedAmount?.toLocaleString()}</p>
                                                                                <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Fee: -${w.platformFee?.toLocaleString()}</p>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-8 py-6">
                                                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{w.method} • {w.accountNumber}</span>
                                                                        </td>
                                                                        <td className="px-8 py-6">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit ${
                                                                                    w.status === 'completed' ? 'bg-green-100 text-green-600' : 
                                                                                    w.status === 'rejected' ? 'bg-red-100 text-red-600' : 
                                                                                    w.status === 'approved' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
                                                                                }`}>
                                                                                    {w.status}
                                                                                </span>
                                                                                {(w.paymentProof || w.adminComment || w.rejectionReason) && (
                                                                                    <span className="text-[8px] font-black text-custom-blue uppercase tracking-widest flex items-center gap-1">
                                                                                        {expandedWithdrawal === w._id ? 'Click to hide details' : 'Click to view details'}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-8 py-6 text-right text-xs font-bold text-gray-400">
                                                                            {new Date(w.createdAt).toLocaleDateString()}
                                                                        </td>
                                                                    </tr>
                                                                    
                                                                    {/* Expandable Details Row */}
                                                                    <AnimatePresence>
                                                                        {expandedWithdrawal === w._id && (
                                                                            <tr>
                                                                                <td colSpan="5" className="px-8 py-0 border-none overflow-hidden">
                                                                                    <motion.div 
                                                                                        initial={{ height: 0, opacity: 0 }}
                                                                                        animate={{ height: 'auto', opacity: 1 }}
                                                                                        exit={{ height: 0, opacity: 0 }}
                                                                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                                                        className="py-6 border-t border-gray-100"
                                                                                    >
                                                                                        <div className="grid md:grid-cols-2 gap-8 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                                                                            {w.status === 'rejected' ? (
                                                                                                <div className="col-span-full">
                                                                                                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Rejection Reason</p>
                                                                                                    <p className="text-sm font-bold text-gray-600 bg-red-50/50 p-4 rounded-xl border border-red-100">
                                                                                                        {w.rejectionReason || 'No reason provided'}
                                                                                                    </p>
                                                                                                </div>
                                                                                            ) : (
                                                                                                <>
                                                                                                    <div>
                                                                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                                                                            <CheckCircle size={12} className="text-green-500" /> Payment Proof
                                                                                                        </p>
                                                                                                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                                                                                            {w.paymentProof ? (
                                                                                                                <div className="flex items-center justify-between gap-4">
                                                                                                                    <p className="text-sm font-black text-custom-black truncate">{w.paymentProof}</p>
                                                                                                                    {w.paymentProof.startsWith('http') && (
                                                                                                                        <a href={w.paymentProof} target="_blank" rel="noreferrer" className="text-custom-blue hover:underline">
                                                                                                                            <ExternalLink size={14} />
                                                                                                                        </a>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            ) : (
                                                                                                                <p className="text-xs font-bold text-gray-400 italic">Pending proof from admin...</p>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                                                                            <Clock size={12} className="text-custom-blue" /> Admin Comment
                                                                                                        </p>
                                                                                                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                                                                                            <p className="text-sm font-bold text-gray-600">
                                                                                                                {w.adminComment || 'No additional comments provided.'}
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </>
                                                                                            )}
                                                                                        </div>
                                                                                    </motion.div>
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </React.Fragment>
                                                            ))
                                                        ) : (
                                                            <tr><td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest">No previous withdrawals for this campaign</td></tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'fulfillment-monitor' && (
                                <motion.div key="fulfillment-monitor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <StatCard label="Total Obligations" value={data.fulfillmentStats.reduce((acc, s) => acc + s.totalRewards, 0)} icon={Heart} color="text-custom-blue" />
                                        <StatCard label="Delivered" value={data.fulfillmentStats.reduce((acc, s) => acc + s.deliveredRewards, 0)} icon={Rocket} color="text-custom-yellow" />
                                        <StatCard label="Confirmed" value={data.fulfillmentStats.reduce((acc, s) => acc + s.confirmedRewards, 0)} icon={CheckCircle} color="text-green-500" />
                                    </div>

                                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-black/5 overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-100">
                                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Campaign / Creator</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery Rate</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Conf. Rate</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Risk Level</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {data.fulfillmentStats.map(s => (
                                                    <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-8 py-6">
                                                            <p className="font-black text-custom-black">{s.title}</p>
                                                            <p className="text-xs font-bold text-gray-400">{s.creator?.name}</p>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-3">
                                                                <span className="font-black text-custom-black text-sm">{s.deliveryRate}%</span>
                                                                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-custom-yellow" style={{ width: `${s.deliveryRate}%` }} />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-3">
                                                                <span className="font-black text-custom-black text-sm">{s.confirmationRate}%</span>
                                                                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-green-500" style={{ width: `${s.confirmationRate}%` }} />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            {s.isHighRisk ? (
                                                                <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit">
                                                                    <ShieldAlert size={12} /> High Risk
                                                                </span>
                                                            ) : (
                                                                <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">Normal</span>
                                                            )}
                                                        </td>
                                                        <td className="px-8 py-6 text-right">
                                                            <button onClick={() => navigate(`/campaign/${s.id}`)} className="p-3 bg-gray-50 text-gray-400 hover:text-custom-black rounded-xl transition-all">
                                                                <Eye size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'notifications' && (
                                <motion.div key="notifications" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-2xl font-black text-custom-black flex items-center gap-3">
                                            <Bell className="text-custom-yellow" /> Activity Center
                                        </h2>
                                        {allNotifications.some(n => !n.isRead) && (
                                            <button 
                                                onClick={markAllAsRead}
                                                className="px-6 py-2 bg-custom-blue/10 text-custom-blue rounded-xl font-black text-xs uppercase tracking-widest hover:bg-custom-blue hover:text-white transition-all"
                                            >
                                                Mark all as read
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid gap-4">
                                        {allNotifications.length > 0 ? allNotifications.map(n => (
                                            <div key={n._id} className={`bg-white p-6 rounded-[32px] border transition-all flex flex-col md:flex-row items-center justify-between gap-6 ${!n.isRead ? 'border-custom-blue/30 shadow-lg shadow-custom-blue/5' : 'border-gray-100 shadow-xl shadow-black/5'}`}>
                                                <div className="flex items-center gap-6 flex-grow">
                                                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl shrink-0">
                                                        {n.type === 'DONATION_RECEIVED' ? '💰' : 
                                                         n.type === 'WITHDRAWAL_UPDATE' ? '🏦' : 
                                                         n.type === 'CAMPAIGN_UPDATE' ? '📢' : 
                                                         n.type === 'VERIFICATION_STATUS' ? '🛡️' : '🔔'}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h3 className={`text-xl font-black ${!n.isRead ? 'text-custom-black' : 'text-gray-500'}`}>{n.title}</h3>
                                                            {!n.isRead && <span className="w-2 h-2 bg-custom-blue rounded-full"></span>}
                                                        </div>
                                                        <p className="text-gray-500 font-bold leading-relaxed">{n.message}</p>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    {n.link && (
                                                        <button 
                                                            onClick={() => {
                                                                markAsRead(n._id);
                                                                navigate(n.link);
                                                            }}
                                                            className="px-6 py-3 bg-custom-black text-custom-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-custom-yellow hover:text-custom-black transition-all"
                                                        >
                                                            View Details
                                                        </button>
                                                    )}
                                                    {!n.isRead && (
                                                        <button 
                                                            onClick={() => markAsRead(n._id)}
                                                            className="p-3 bg-gray-100 text-gray-400 hover:text-custom-blue rounded-2xl transition-all"
                                                            title="Mark as read"
                                                        >
                                                            <CheckCircle size={20} />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => deleteNotification(n._id)}
                                                        className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                                                <Bell size={48} className="mx-auto text-gray-200 mb-4" />
                                                <p className="text-gray-400 font-bold uppercase tracking-widest">Your activity center is empty</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'settings' && (
                                <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                                    <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-black/5 max-w-4xl">
                                        <h2 className="text-2xl font-black text-custom-black mb-8 flex items-center gap-3">
                                            <Settings className="text-custom-yellow" /> Public Profile Settings
                                        </h2>
                                        <form onSubmit={handleUpdateProfile} className="space-y-8">
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Full Name</label>
                                                    <input 
                                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" 
                                                        value={user?.name || ''} 
                                                        disabled
                                                    />
                                                    <p className="text-[10px] text-gray-400 font-bold ml-2 italic">Name cannot be changed for security</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Website URL</label>
                                                    <input 
                                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" 
                                                        value={profileForm.website} 
                                                        onChange={e => setProfileForm({...profileForm, website: e.target.value})}
                                                        placeholder="https://yourwebsite.com" 
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Biography</label>
                                                <textarea 
                                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-6 rounded-3xl font-bold transition-all min-h-[160px]" 
                                                    value={profileForm.bio} 
                                                    onChange={e => setProfileForm({...profileForm, bio: e.target.value})}
                                                    placeholder="Share your story and vision with the community..." 
                                                />
                                            </div>

                                            <div className="grid md:grid-cols-3 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Facebook</label>
                                                    <input 
                                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" 
                                                        value={profileForm.socialLinks.facebook} 
                                                        onChange={e => setProfileForm({...profileForm, socialLinks: {...profileForm.socialLinks, facebook: e.target.value}})}
                                                        placeholder="Profile URL" 
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Twitter</label>
                                                    <input 
                                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" 
                                                        value={profileForm.socialLinks.twitter} 
                                                        onChange={e => setProfileForm({...profileForm, socialLinks: {...profileForm.socialLinks, twitter: e.target.value}})}
                                                        placeholder="Profile URL" 
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">LinkedIn</label>
                                                    <input 
                                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" 
                                                        value={profileForm.socialLinks.linkedin} 
                                                        onChange={e => setProfileForm({...profileForm, socialLinks: {...profileForm.socialLinks, linkedin: e.target.value}})}
                                                        placeholder="Profile URL" 
                                                    />
                                                </div>
                                            </div>

                                            <button 
                                                disabled={updatingProfile}
                                                type="submit" 
                                                className="w-full bg-custom-black text-custom-white py-5 rounded-2xl font-black text-lg hover:bg-custom-yellow hover:text-custom-black transition-all shadow-xl shadow-black/10 disabled:opacity-50"
                                            >
                                                {updatingProfile ? 'SAVING CHANGES...' : 'UPDATE PROFILE'}
                                            </button>
                                        </form>
                                    </section>
                                </motion.div>
                            )}
                        </>
                    )}
                </AnimatePresence>

                {/* Creator Application Modal */}
                <AnimatePresence>
                    {isCreatorModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreatorModalOpen(false)} className="absolute inset-0 bg-custom-black/80 backdrop-blur-sm" />
                            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden" >
                                <div className="p-8 md:p-12">
                                    <h2 className="text-3xl font-black text-custom-black uppercase tracking-tighter mb-4">Creator Application</h2>
                                    <p className="text-gray-500 font-bold mb-8">Please provide additional information for verification.</p>
                                    <form onSubmit={handleApplyCreator} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">National ID (NID)</label>
                                            <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={creatorForm.nid} onChange={e => setCreatorForm({...creatorForm, nid: e.target.value})} placeholder="XXXX-XXXX-XXXX" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Physical Address</label>
                                            <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={creatorForm.address} onChange={e => setCreatorForm({...creatorForm, address: e.target.value})} placeholder="House, Road, City" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Phone Number</label>
                                            <input className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={creatorForm.phone} onChange={e => setCreatorForm({...creatorForm, phone: e.target.value})} placeholder="+880 1XXX-XXXXXX" />
                                        </div>
                                        <button disabled={applyingCreator} type="submit" className="w-full bg-custom-black text-custom-white py-5 rounded-2xl font-black text-lg hover:bg-custom-yellow hover:text-custom-black transition-all shadow-xl shadow-black/10 disabled:opacity-50" >
                                            {applyingCreator ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
                {/* Payout Request Modal */}
                <AnimatePresence>
                    {showPayoutModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPayoutModal(false)} className="absolute inset-0 bg-custom-black/80 backdrop-blur-sm" />
                            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden" >
                                <div className="p-8 md:p-12">
                                    <h2 className="text-3xl font-black text-custom-black uppercase tracking-tighter mb-4 flex items-center gap-3">
                                        <Wallet className="text-custom-yellow" /> Request Payout
                                    </h2>
                                    <p className="text-gray-500 font-bold mb-8">Funds will be transferred to your specified account after admin review.</p>
                                    <form onSubmit={handleRequestPayout} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Amount to Withdraw (Max: ${withdrawalStats?.currentAvailable})</label>
                                            <input required type="number" max={withdrawalStats?.currentAvailable} className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={payoutForm.amount} onChange={e => setPayoutForm({...payoutForm, amount: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Transfer Method</label>
                                            <select className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={payoutForm.method} onChange={e => setPayoutForm({...payoutForm, method: e.target.value})}>
                                                <option>Bank Transfer</option>
                                                <option>Bkash</option>
                                                <option>Nagad</option>
                                                <option>Paypal</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Account Details (Number / IBAN)</label>
                                            <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={payoutForm.accountNumber} onChange={e => setPayoutForm({...payoutForm, accountNumber: e.target.value})} placeholder="e.g. 017XXXXXXXX or Account No." />
                                        </div>
                                        <button disabled={requestingPayout} type="submit" className="w-full bg-custom-black text-custom-white py-5 rounded-2xl font-black text-lg hover:bg-custom-yellow hover:text-custom-black transition-all shadow-xl shadow-black/10 disabled:opacity-50" >
                                            {requestingPayout ? 'SUBMITTING...' : 'REQUEST WITHDRAWAL'}
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Status Update Confirmation/Rejection Modal */}
                <AnimatePresence>
                    {statusModal.show && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setStatusModal({ ...statusModal, show: false })} className="absolute inset-0 bg-custom-black/80 backdrop-blur-sm" />
                            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative z-10 overflow-hidden" >
                                <div className="p-10">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                                        statusModal.type === 'rejected' ? 'bg-red-100 text-red-500' : 
                                        statusModal.type === 'approved' ? 'bg-green-100 text-green-500' : 'bg-blue-100 text-blue-500'
                                    }`}>
                                        {statusModal.type === 'rejected' ? <XCircle size={32} /> : <CheckCircle size={32} />}
                                    </div>
                                    
                                    <h2 className="text-3xl font-black text-custom-black uppercase tracking-tighter mb-2">
                                        {statusModal.type === 'rejected' ? 'Reject Withdrawal' : 
                                         statusModal.type === 'approved' ? 'Approve Withdrawal' : 'Complete Payout'}
                                    </h2>
                                    <p className="text-gray-500 font-bold mb-8">
                                        {statusModal.type === 'rejected' ? 'Are you sure you want to reject this request? This will refund the amount to the project balance.' : 
                                         statusModal.type === 'approved' ? 'Are you sure you want to approve this request? The creator will be notified.' : 
                                         'Mark this payout as successfully transferred to the creator.'}
                                    </p>

                                    {statusModal.type === 'rejected' && (
                                        <div className="space-y-2 mb-8">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Reason for Rejection (Mandatory)</label>
                                            <textarea 
                                                required 
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-red-500 outline-none px-6 py-4 rounded-2xl font-bold transition-all min-h-[100px]" 
                                                value={statusModal.reason} 
                                                onChange={e => setStatusModal({...statusModal, reason: e.target.value})} 
                                                placeholder="e.g. Invalid bank details, Account frozen, etc."
                                            />
                                        </div>
                                    )}

                                    {(statusModal.type === 'approved' || statusModal.type === 'completed') && (
                                        <div className="space-y-6 mb-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                                                    Payment Proof {statusModal.type === 'completed' && '(Mandatory)'}
                                                </label>
                                                <input 
                                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" 
                                                    value={statusModal.paymentProof} 
                                                    onChange={e => setStatusModal({...statusModal, paymentProof: e.target.value})} 
                                                    placeholder="e.g. Transaction ID, Receipt URL, etc."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Admin Comment (Optional)</label>
                                                <textarea 
                                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all min-h-[80px]" 
                                                    value={statusModal.adminComment} 
                                                    onChange={e => setStatusModal({...statusModal, adminComment: e.target.value})} 
                                                    placeholder="Message for the creator..."
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => setStatusModal({ ...statusModal, show: false })}
                                            className="flex-grow bg-gray-100 text-gray-400 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 hover:text-custom-black transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            disabled={statusModal.isProcessing}
                                            onClick={handleConfirmStatusUpdate}
                                            className={`flex-grow py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg ${
                                                statusModal.type === 'rejected' ? 'bg-red-500 text-white shadow-red-500/20' : 
                                                'bg-custom-black text-white shadow-black/20'
                                            } disabled:opacity-50`}
                                        >
                                            {statusModal.isProcessing ? 'Processing...' : 'Confirm'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-black/5">
        <div className={`${color} mb-6`}>
            <Icon size={32} />
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-4xl font-black text-custom-black tracking-tight">{value}</p>
    </div>
);

export default DynamicDashboard;

