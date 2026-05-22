import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, ExternalLink, Clock } from 'lucide-react';
import { useNotifications } from '../../Contexts/NotificationContext';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, loading } = useNotifications();
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getTypeIcon = (type) => {
        switch (type) {
            case 'DONATION_RECEIVED': return '💰';
            case 'WITHDRAWAL_UPDATE': return '🏦';
            case 'CAMPAIGN_UPDATE': return '📢';
            case 'VERIFICATION_STATUS': return '🛡️';
            case 'MILESTONE_REACHED': return '🎯';
            default: return '🔔';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-gray-400 hover:text-primary hover:bg-white/5 transition-all active:scale-90"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white border-2 border-border-light">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-background border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-xl bg-opacity-95">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between bg-white/5">
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-text-primary">Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={markAllAsRead}
                                className="text-xs font-semibold text-primary hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <Check size={14} /> Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {loading && notifications.length === 0 ? (
                            <div className="p-4 text-center">
                                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                                <p className="text-xs text-gray-500 font-semibold uppercase">Loading...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-6 text-center">
                                <Bell size={48} className="mx-auto text-gray-800 mb-2 opacity-20" />
                                <p className="text-sm font-semibold text-gray-500">All caught up!</p>
                                <p className="text-xs text-gray-600 mt-1">No new notifications for you.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-800/50">
                                {notifications.map((n) => (
                                    <div 
                                        key={n._id}
                                        className={`p-2 hover:bg-white/5 transition-colors group relative ${!n.isRead ? 'bg-primary/5' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="text-2xl mt-1">{getTypeIcon(n.type)}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <p className={`text-sm font-semibold truncate pr-6 ${!n.isRead ? 'text-text-primary' : 'text-gray-400'}`}>
                                                        {n.title}
                                                    </p>
                                                    {!n.isRead && (
                                                        <div className="absolute right-4 top-5 w-2 h-2 bg-primary rounded-full"></div>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                                                    {n.message}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-[10px] text-gray-600 font-semibold flex items-center gap-1 uppercase tracking-tighter">
                                                        <Clock size={10} /> {formatDistanceToNow(new Date(n.createdAt))} ago
                                                    </span>
                                                    {n.link && (
                                                        <Link 
                                                            to={n.link} 
                                                            onClick={() => {
                                                                setIsOpen(false);
                                                                markAsRead(n._id);
                                                            }}
                                                            className="text-[10px] text-primary hover:underline font-semibold flex items-center gap-1 uppercase tracking-tighter"
                                                        >
                                                            View <ExternalLink size={10} />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Actions on hover */}
                                        <div className="absolute right-2 bottom-2 hidden group-hover:flex items-center gap-1">
                                            {!n.isRead && (
                                                <button 
                                                    onClick={() => markAsRead(n._id)}
                                                    className="p-1.5 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                                                    title="Mark as read"
                                                >
                                                    <Check size={14} />
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => deleteNotification(n._id)}
                                                className="p-1.5 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-800 bg-white/5 text-center">
                            <Link 
                                to="/dashboard?tab=notifications" 
                                onClick={() => setIsOpen(false)}
                                className="text-xs font-semibold text-gray-400 hover:text-text-primary uppercase tracking-widest transition-colors"
                            >
                                View all notifications
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
