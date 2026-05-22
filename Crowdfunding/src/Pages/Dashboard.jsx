import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import api from '../api/axios';
import { 
    PlusCircle,
    Menu,
    X
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useNotifications } from '../Contexts/NotificationContext';

// Modular Components
import Sidebar from '../Components/Dashboard/Sidebar';
import OverviewTab from '../Components/Dashboard/Tabs/OverviewTab';
import ApprovalsTab from '../Components/Dashboard/Tabs/ApprovalsTab';
import UserApprovalsTab from '../Components/Dashboard/Tabs/UserApprovalsTab';
import UserManagementTab from '../Components/Dashboard/Tabs/UserManagementTab';
import SuccessStoriesTab from '../Components/Dashboard/Tabs/SuccessStoriesTab';
import FinanceTab from '../Components/Dashboard/Tabs/FinanceTab';
import FulfillmentMonitorTab from '../Components/Dashboard/Tabs/FulfillmentMonitorTab';
import MyProjectsTab from '../Components/Dashboard/Tabs/MyProjectsTab';
import BackerManagementTab from '../Components/Dashboard/Tabs/BackerManagementTab';
import ContributionsTab from '../Components/Dashboard/Tabs/ContributionsTab';
import BackedProjectsTab from '../Components/Dashboard/Tabs/BackedProjectsTab';
import WithdrawalsTab from '../Components/Dashboard/Tabs/WithdrawalsTab';
import UpdatesTab from '../Components/Dashboard/Tabs/UpdatesTab';
import NotificationsTab from '../Components/Dashboard/Tabs/NotificationsTab';
import SettingsTab from '../Components/Dashboard/Tabs/SettingsTab';
import MyDonationsTab from '../Components/Dashboard/Tabs/MyDonationsTab';

// Modals
import CreatorApplicationModal from '../Components/Dashboard/Modals/CreatorApplicationModal';
import PayoutRequestModal from '../Components/Dashboard/Modals/PayoutRequestModal';
import StatusUpdateModal from '../Components/Dashboard/Modals/StatusUpdateModal';

const DynamicDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const { notifications: allNotifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();

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
        campaignBackers: null, // For creator backer management
        stats: null // Global platform stats for admin
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
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [changingPassword, setChangingPassword] = useState(false);
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
        images: '',
        isBackerOnly: false
    });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                        const [statsRes, campRes, userRes] = await Promise.all([
                            api.get('/campaigns/admin/stats'),
                            api.get('/campaigns?status=pending'),
                            api.get('/auth/users/pending')
                        ]);
                        updateData({ 
                            stats: statsRes.data,
                            pendingApprovals: campRes.data, 
                            pendingUsers: userRes.data 
                        });
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

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('New passwords do not match');
            return;
        }
        setChangingPassword(true);
        try {
            await api.patch('/auth/change-password', {
                oldPassword: passwordForm.oldPassword,
                newPassword: passwordForm.newPassword
            });
            alert('Password changed successfully!');
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            alert(error.response?.data?.message || 'Password change failed');
        } finally {
            setChangingPassword(false);
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

    return (
        <div className="min-h-[calc(100vh-80px)] bg-white flex flex-col lg:flex-row">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-border-light">
                <h2 className="text-lg font-bold text-text-primary uppercase tracking-tighter">Dashboard</h2>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-400">
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Sidebar (Responsive) */}
            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
                <Sidebar 
                    user={user} 
                    isAdmin={isAdmin} 
                    isCreator={isCreator} 
                    activeTab={activeTab} 
                    setSearchParams={setSearchParams} 
                />
            </div>

            {/* Content Area */}
            <main className="flex-grow bg-background p-6 lg:p-10 overflow-y-auto">
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-2">Dashboard</p>
                        <h1 className="text-3xl font-bold text-text-primary uppercase tracking-tighter">
                            {activeTab.replace('-', ' ')}
                        </h1>
                    </div>
                    {isCreator && (
                        <button onClick={() => navigate('/create-campaign')} className="bg-white text-text-primary px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-3 border border-border-light hover:bg-background transition-all shadow-sm">
                            <PlusCircle size={18} /> Launch Project
                        </button>
                    )}
                </header>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="flex items-center justify-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : tabLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                            <p className="ml-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Updating {activeTab.replace('-', ' ')}...</p>
                        </div>
                    ) : (
                        <div className="min-h-[400px]">
                            {activeTab === 'overview' && (
                                <OverviewTab 
                                    isAdmin={isAdmin} 
                                    isCreator={isCreator} 
                                    isBackerOnly={isBackerOnly} 
                                    user={user} 
                                    data={data} 
                                    navigate={navigate} 
                                    setIsCreatorModalOpen={setIsCreatorModalOpen} 
                                    handleApprove={handleApprove} 
                                />
                            )}

                            {activeTab === 'approvals' && (
                                <ApprovalsTab 
                                    data={data} 
                                    navigate={navigate} 
                                    handleApprove={handleApprove} 
                                    handleToggleCampaignBan={handleToggleCampaignBan} 
                                />
                            )}

                            {activeTab === 'user-approvals' && (
                                <UserApprovalsTab 
                                    data={data} 
                                    processingReg={processingReg} 
                                    handleApproveRegistration={handleApproveRegistration} 
                                />
                            )}

                            {activeTab === 'users' && (
                                <UserManagementTab 
                                    data={data} 
                                    processingUser={processingUser} 
                                    handleToggleBan={handleToggleBan} 
                                    navigate={navigate} 
                                />
                            )}

                            {activeTab === 'success-stories' && (
                                <SuccessStoriesTab 
                                    data={data} 
                                    storyForm={storyForm} 
                                    setStoryForm={setStoryForm} 
                                    uploadingStory={uploadingStory} 
                                    editStoryId={editStoryId} 
                                    setEditStoryId={setEditStoryId} 
                                    handleCreateStory={handleCreateStory} 
                                    handleEditStory={handleEditStory} 
                                    handleDeleteStory={handleDeleteStory} 
                                />
                            )}

                            {activeTab === 'finance' && (
                                <FinanceTab 
                                    financeSubTab={financeSubTab} 
                                    setFinanceSubTab={setFinanceSubTab} 
                                    data={data} 
                                    updatingBackerStatus={updatingBackerStatus} 
                                    handleUpdateWithdrawalStatus={handleUpdateWithdrawalStatus} 
                                />
                            )}

                            {activeTab === 'fulfillment-monitor' && (
                                <FulfillmentMonitorTab data={data} />
                            )}

                            {activeTab === 'my-projects' && (
                                <MyProjectsTab 
                                    data={data} 
                                    navigate={navigate} 
                                    setSearchParams={setSearchParams} 
                                    setStoryForm={setStoryForm} 
                                    user={user} 
                                />
                            )}

                            {activeTab === 'backed-projects' && (
                                <BackedProjectsTab 
                                    data={data} 
                                    confirmingDelivery={confirmingDelivery} 
                                    handleConfirmDelivery={handleConfirmDelivery} 
                                />
                            )}

                            {activeTab === 'contributions' && (
                                <ContributionsTab data={data} />
                            )}

                            {activeTab === 'backer-management' && (
                                <BackerManagementTab 
                                    selectedCampaignForBackers={selectedCampaignForBackers} 
                                    setSelectedCampaignForBackers={setSelectedCampaignForBackers} 
                                    data={data} 
                                    handleFetchBackers={handleFetchBackers} 
                                    handleUpdateCampaignProgress={handleUpdateCampaignProgress} 
                                    updatingCampaignProgress={updatingCampaignProgress} 
                                    backerStatusFilter={backerStatusFilter} 
                                    setBackerStatusFilter={setBackerStatusFilter} 
                                    updatingBackerStatus={updatingBackerStatus} 
                                    handleUpdateBackerStatus={handleUpdateBackerStatus} 
                                />
                            )}

                            {activeTab === 'updates' && (
                                <UpdatesTab 
                                    handlePostUpdate={handlePostUpdate} 
                                    updateForm={updateForm} 
                                    setUpdateForm={setUpdateForm} 
                                    fetchUpdatesForCampaign={fetchUpdatesForCampaign} 
                                    data={data} 
                                    postingUpdate={postingUpdate} 
                                    handleDeleteUpdate={handleDeleteUpdate} 
                                />
                            )}

                            {activeTab === 'withdrawals' && (
                                <WithdrawalsTab 
                                    selectedCampaignForWithdrawal={selectedCampaignForWithdrawal} 
                                    setSelectedCampaignForWithdrawal={setSelectedCampaignForWithdrawal} 
                                    data={data} 
                                    fetchWithdrawalStats={fetchWithdrawalStats} 
                                    withdrawalStats={withdrawalStats} 
                                    setShowPayoutModal={setShowPayoutModal} 
                                />
                            )}

                            {activeTab === 'notifications' && (
                                <NotificationsTab 
                                    notifications={allNotifications} 
                                    clearAll={clearAll} 
                                    markAsRead={markAsRead} 
                                    deleteNotification={deleteNotification} 
                                    navigate={navigate} 
                                />
                            )}

                            {activeTab === 'donations' && (
                                <MyDonationsTab data={data} />
                            )}

                            {activeTab === 'settings' && (
                                <SettingsTab 
                                    user={user} 
                                    handleUpdateProfile={handleUpdateProfile} 
                                    profileForm={profileForm} 
                                    setProfileForm={setProfileForm} 
                                    updatingProfile={updatingProfile}
                                    handleChangePassword={handleChangePassword}
                                    passwordForm={passwordForm}
                                    setPasswordForm={setPasswordForm}
                                    changingPassword={changingPassword} 
                                />
                            )}
                        </div>
                    )}
                </AnimatePresence>

                {/* Modals */}
                <CreatorApplicationModal 
                    isOpen={isCreatorModalOpen} 
                    onClose={() => setIsCreatorModalOpen(false)} 
                    handleApplyCreator={handleApplyCreator} 
                    creatorForm={creatorForm} 
                    setCreatorForm={setCreatorForm} 
                    applyingCreator={applyingCreator} 
                />

                <PayoutRequestModal 
                    isOpen={showPayoutModal} 
                    onClose={() => setShowPayoutModal(false)} 
                    handleRequestPayout={handleRequestPayout} 
                    withdrawalStats={withdrawalStats} 
                    payoutForm={payoutForm} 
                    setPayoutForm={setPayoutForm} 
                    requestingPayout={requestingPayout} 
                />

                <StatusUpdateModal 
                    statusModal={statusModal} 
                    setStatusModal={setStatusModal} 
                    handleConfirmStatusUpdate={handleConfirmStatusUpdate} 
                    updatingBackerStatus={updatingBackerStatus} 
                />
            </main>
        </div>
    );
};

export default DynamicDashboard;
