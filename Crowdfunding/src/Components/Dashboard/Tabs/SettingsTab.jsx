import React from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

const SettingsTab = ({ 
    user, 
    handleUpdateProfile, 
    profileForm, 
    setProfileForm, 
    updatingProfile,
    handleChangePassword,
    passwordForm,
    setPasswordForm,
    changingPassword 
}) => {
    return (
        <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            <section className="bg-white p-5 rounded-[40px] border border-gray-100 shadow-xl shadow-text-primary/5 max-w-4xl">
                <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
                    <Settings className="text-primary" /> Profile Info
                </h2>
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                    {/* ... (profile fields same as before) */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Full Name</label>
                            <input 
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-primary outline-none px-3 py-4 rounded-2xl font-semibold transition-all" 
                                value={user?.name || ''} 
                                disabled
                            />
                            <p className="text-[10px] text-gray-400 font-semibold ml-2 italic">Name cannot be changed for security</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Website URL</label>
                            <input 
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-primary outline-none px-3 py-4 rounded-2xl font-semibold transition-all" 
                                value={profileForm.website} 
                                onChange={e => setProfileForm({...profileForm, website: e.target.value})}
                                placeholder="https://yourwebsite.com" 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Biography</label>
                        <textarea 
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary outline-none px-3 py-6 rounded-3xl font-semibold transition-all min-h-[160px]" 
                            value={profileForm.bio} 
                            onChange={e => setProfileForm({...profileForm, bio: e.target.value})}
                            placeholder="Share your story and vision with the community..." 
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Facebook</label>
                            <input 
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-primary outline-none px-3 py-4 rounded-2xl font-semibold transition-all" 
                                value={profileForm.socialLinks.facebook} 
                                onChange={e => setProfileForm({...profileForm, socialLinks: {...profileForm.socialLinks, facebook: e.target.value}})}
                                placeholder="Profile URL" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Twitter</label>
                            <input 
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-primary outline-none px-3 py-4 rounded-2xl font-semibold transition-all" 
                                value={profileForm.socialLinks.twitter} 
                                onChange={e => setProfileForm({...profileForm, socialLinks: {...profileForm.socialLinks, twitter: e.target.value}})}
                                placeholder="Profile URL" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">LinkedIn</label>
                            <input 
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-primary outline-none px-3 py-4 rounded-2xl font-semibold transition-all" 
                                value={profileForm.socialLinks.linkedin} 
                                onChange={e => setProfileForm({...profileForm, socialLinks: {...profileForm.socialLinks, linkedin: e.target.value}})}
                                placeholder="Profile URL" 
                            />
                        </div>
                    </div>

                    <button 
                        disabled={updatingProfile}
                        type="submit" 
                        className="w-full bg-background text-text-primary py-5 rounded-2xl font-bold text-lg hover:bg-cream hover:text-text-primary transition-all shadow-xl shadow-text-primary/10 disabled:opacity-50"
                    >
                        {updatingProfile ? 'SAVING CHANGES...' : 'UPDATE PROFILE'}
                    </button>
                </form>
            </section>

            <section className="bg-white p-5 rounded-[40px] border border-gray-100 shadow-xl shadow-text-primary/5 max-w-4xl">
                <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
                    <Settings className="text-primary" /> Security
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Current Password</label>
                        <input 
                            type="password"
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary outline-none px-3 py-4 rounded-2xl font-semibold transition-all" 
                            value={passwordForm.oldPassword} 
                            onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                            required
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">New Password</label>
                            <input 
                                type="password"
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-primary outline-none px-3 py-4 rounded-2xl font-semibold transition-all" 
                                value={passwordForm.newPassword} 
                                onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Confirm New Password</label>
                            <input 
                                type="password"
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-primary outline-none px-3 py-4 rounded-2xl font-semibold transition-all" 
                                value={passwordForm.confirmPassword} 
                                onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <button 
                        disabled={changingPassword}
                        type="submit" 
                        className="w-full bg-background text-text-primary py-5 rounded-2xl font-bold text-lg hover:bg-cream hover:text-text-primary transition-all shadow-xl shadow-text-primary/10 disabled:opacity-50"
                    >
                        {changingPassword ? 'CHANGING PASSWORD...' : 'CHANGE PASSWORD'}
                    </button>
                </form>
            </section>
        </motion.div>
    );
};

export default SettingsTab;
