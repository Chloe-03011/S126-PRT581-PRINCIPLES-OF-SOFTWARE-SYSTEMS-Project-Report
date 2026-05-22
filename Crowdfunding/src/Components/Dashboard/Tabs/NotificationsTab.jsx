import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Trash2, CheckCircle } from 'lucide-react';

const NotificationsTab = ({ 
    notifications, 
    clearAll, 
    markAsRead, 
    deleteNotification, 
    navigate 
}) => {
    return (
        <motion.div key="notifications" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex justify-between items-center ml-4">
                <h2 className="text-2xl font-bold text-text-primary uppercase tracking-tighter">Your Activity</h2>
                {notifications.length > 0 && (
                    <button 
                        onClick={clearAll}
                        className="text-xs font-bold text-red-500 uppercase tracking-widest hover:underline"
                    >
                        Clear All History
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {notifications.length > 0 ? notifications.map(n => (
                    <div 
                        key={n._id} 
                        className={`group bg-white p-4 rounded-[32px] border transition-all flex flex-col md:flex-row items-center justify-between gap-8 ${
                            n.isRead ? 'border-gray-100 opacity-60' : 'border-primary/30 shadow-xl shadow-primary/5 ring-1 ring-primary/10'
                        }`}
                    >
                        <div className="flex items-center gap-6">
                            <div className={`p-2 rounded-2xl ${
                                n.type === 'SUCCESS' ? 'bg-green-50 text-green-600' :
                                n.type === 'ALERT' ? 'bg-red-50 text-red-600' :
                                'bg-blue-50 text-primary'
                            }`}>
                                <Bell size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-text-primary text-lg">{n.title}</h4>
                                <p className="text-gray-500 font-semibold text-sm leading-relaxed">{n.message}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            {n.link && (
                                <button 
                                    onClick={() => {
                                        markAsRead(n._id);
                                        navigate(n.link);
                                    }}
                                    className="px-3 py-3 bg-background text-text-primary rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-cream hover:text-text-primary transition-all"
                                >
                                    View Details
                                </button>
                            )}
                            {!n.isRead && (
                                <button 
                                    onClick={() => markAsRead(n._id)}
                                    className="p-3 bg-gray-100 text-gray-400 hover:text-primary rounded-2xl transition-all"
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
                    <div className="py-10 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                        <Bell size={48} className="mx-auto text-gray-200 mb-2" />
                        <p className="text-gray-400 font-semibold uppercase tracking-widest">Your story is just beginning</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default NotificationsTab;
